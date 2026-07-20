"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useNarrationStore } from "../store";
import type { Alignment } from "../types";

interface NarrationResponse {
  audioUrl: string;
  alignment: Alignment;
}

async function fetchNarration(slug: string): Promise<NarrationResponse | null> {
  const response = await fetch("/api/text-to-speech", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug }),
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

interface UseNarrationFetchOptions {
  slug: string;
}

export function useNarrationFetch({ slug }: UseNarrationFetchOptions) {
  const {
    setAudioData,
    setStatus,
    setError,
    setIsPlaying,
    setCurrentTime,
    setDuration,
  } = useNarrationStore(
    useShallow((state) => ({
      setAudioData: state.setAudioData,
      setStatus: state.setStatus,
      setError: state.setError,
      setIsPlaying: state.setIsPlaying,
      setCurrentTime: state.setCurrentTime,
      setDuration: state.setDuration,
    })),
  );

  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ["narration", slug],
    queryFn: () => fetchNarration(slug),
    enabled: !!slug,
  });

  useEffect(() => {
    if (isPending) {
      setStatus("loading");
      setError(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudioData(null, null);
      return;
    }

    if (isError) {
      setAudioData(null, null);
      setIsPlaying(false);
      setError("Audio unavailable");
      setStatus("error");
      return;
    }

    if (isSuccess) {
      if (data) {
        setAudioData(data.audioUrl ?? null, data.alignment ?? null);
        setStatus("ready");
      } else {
        setAudioData(null, null);
        setStatus("unavailable");
      }
    }
  }, [
    data,
    isPending,
    isError,
    isSuccess,
    setAudioData,
    setError,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setStatus,
  ]);
}
