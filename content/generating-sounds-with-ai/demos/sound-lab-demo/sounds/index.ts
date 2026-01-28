export type FeelParams = {
  filterFreq: number;
  q: number;
  oscType: OscillatorType;
  decayMult: number;
  gainMult: number;
  pitchMult: number;
};

export function playClick(ctx: AudioContext, t: number, params: FeelParams) {
  const duration = 0.008 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (50 * params.decayMult));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = params.filterFreq;
  filter.Q.value = params.q;

  const gain = ctx.createGain();
  gain.gain.value = 0.5 * params.gainMult;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
}

export function playPop(ctx: AudioContext, t: number, params: FeelParams) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = params.oscType;
  osc.frequency.setValueAtTime(400 * params.pitchMult, t);
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.04 * params.decayMult);

  gain.gain.setValueAtTime(0.35 * params.gainMult, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05 * params.decayMult);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.05 * params.decayMult);
}

export function playToggle(ctx: AudioContext, t: number, params: FeelParams) {
  // Noise layer
  const duration = 0.012 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (80 * params.decayMult));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2500;
  filter.Q.value = params.q;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.4 * params.gainMult;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(t);

  // Tone layer
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = params.oscType;
  osc.frequency.setValueAtTime(800 * params.pitchMult, t);
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.03 * params.decayMult);

  oscGain.gain.setValueAtTime(0.15 * params.gainMult, t);
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04 * params.decayMult);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.04 * params.decayMult);
}

export function playTick(ctx: AudioContext, t: number, params: FeelParams) {
  const duration = 0.004 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (20 * params.decayMult));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000 * params.pitchMult;

  const gain = ctx.createGain();
  gain.gain.value = 0.3 * params.gainMult;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
}

export function playDrop(ctx: AudioContext, t: number, params: FeelParams) {
  // Downward pitch drop - like something dropping
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = params.oscType;
  // Quick downward sweep
  osc.frequency.setValueAtTime(800 * params.pitchMult, t);
  osc.frequency.exponentialRampToValueAtTime(
    300 * params.pitchMult,
    t + 0.1 * params.decayMult,
  );

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.35 * params.gainMult, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12 * params.decayMult);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.12 * params.decayMult);
}

export function playSuccess(ctx: AudioContext, t: number, params: FeelParams) {
  const notes = [523.25, 659.25, 783.99].map((n) => n * params.pitchMult);
  const spacing = 0.08 * params.decayMult;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = params.oscType === "square" ? "triangle" : params.oscType;
    osc.frequency.value = freq;

    const start = t + i * spacing;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.25 * params.gainMult, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      start + 0.15 * params.decayMult,
    );

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.15 * params.decayMult);
  });
}

export function playError(ctx: AudioContext, t: number, params: FeelParams) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  const baseFreq = 180 * params.pitchMult;
  osc1.type = params.oscType === "sine" ? "sawtooth" : params.oscType;
  osc1.frequency.setValueAtTime(baseFreq, t);
  osc1.frequency.exponentialRampToValueAtTime(80, t + 0.25 * params.decayMult);

  osc2.type = params.oscType === "sine" ? "square" : params.oscType;
  osc2.frequency.setValueAtTime(baseFreq * 1.05, t);
  osc2.frequency.exponentialRampToValueAtTime(85, t + 0.25 * params.decayMult);

  gain.gain.setValueAtTime(0.2 * params.gainMult, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25 * params.decayMult);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(filter);
  filter.connect(ctx.destination);

  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + 0.25 * params.decayMult);
  osc2.stop(t + 0.25 * params.decayMult);
}

export function playWarning(ctx: AudioContext, t: number, params: FeelParams) {
  [0, 0.15 * params.decayMult].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = params.oscType === "square" ? "triangle" : params.oscType;
    osc.frequency.value = (i === 0 ? 880 : 698) * params.pitchMult;

    const start = t + delay;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.3 * params.gainMult, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      start + 0.12 * params.decayMult,
    );

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.12 * params.decayMult);
  });
}

export function playStartup(ctx: AudioContext, t: number, params: FeelParams) {
  const chordNotes = [392, 493.88, 587.33, 784].map(
    (n) => n * params.pitchMult,
  );
  const delays = [0, 0.02, 0.04, 0.06].map((d) => d * params.decayMult);

  chordNotes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = params.oscType === "square" ? "triangle" : params.oscType;
    osc.frequency.value = freq;
    osc2.type = osc.type;
    osc2.frequency.value = freq * 1.002;

    filter.type = "lowpass";
    filter.frequency.value = 2000;

    const start = t + delays[i];
    const duration = 0.6 * params.decayMult - delays[i];

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.14 * params.gainMult, start + 0.05);
    gain.gain.setValueAtTime(0.14 * params.gainMult, start + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc2.start(start);
    osc.stop(start + duration);
    osc2.stop(start + duration);
  });
}
