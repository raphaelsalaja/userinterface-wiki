import { Buffer } from "node:buffer";
import {
  buildWordTimestamps,
  type ElevenLabsAlignment,
  type WordTimestamp,
} from "./alignment";
import { DEFAULT_MODEL_ID, STANDARD_VOICE_FALLBACK } from "./constants";

interface ElevenLabsResponse {
  audio_base64?: string;
  alignment?: ElevenLabsAlignment;
  normalized_alignment?: ElevenLabsAlignment;
}

export function resolveVoiceId(requested?: unknown) {
  if (typeof requested === "string" && requested.trim()) {
    return requested.trim();
  }
  if (process.env.ELEVENLABS_STANDARD_VOICE_ID?.trim()) {
    return process.env.ELEVENLABS_STANDARD_VOICE_ID.trim();
  }
  return STANDARD_VOICE_FALLBACK;
}

export function resolveModelId(requested?: unknown) {
  if (typeof requested === "string" && requested.trim()) {
    return requested.trim();
  }
  if (process.env.ELEVENLABS_MODEL_ID?.trim()) {
    return process.env.ELEVENLABS_MODEL_ID.trim();
  }
  return DEFAULT_MODEL_ID;
}

export async function synthesizeSpeech(
  text: string,
  voiceId: string,
  modelId: string,
): Promise<{ audioBuffer: Buffer; timestamps: WordTimestamp[] }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set");

  const endpoint = new URL(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
  );
  endpoint.searchParams.set("enable_logging", "true");
  endpoint.searchParams.set("output_format", "mp3_44100_128");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: { stability: 0.4, similarity_boost: 0.8 },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `ElevenLabs request failed: ${response.status} - ${message}`,
    );
  }

  const data = (await response.json()) as ElevenLabsResponse;
  if (!data.audio_base64) {
    throw new Error("ElevenLabs response missing audio data");
  }

  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  let timestamps = buildWordTimestamps(data.alignment);

  if (!timestamps.length) {
    timestamps = buildWordTimestamps(data.normalized_alignment);
  }

  return { audioBuffer, timestamps };
}
