let sharedCtx: AudioContext | null = null;

export const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!sharedCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      sharedCtx = new AudioContextClass();
    }
  }
  return sharedCtx;
};

// Resumes the AudioContext if it is suspended by browser autoplay policy
export const resumeAudioContext = async () => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {
      // Ignored: silent fallback for blocked environments
    }
  }
};

// Global click/touch hooks to resume context on first interaction
if (typeof window !== 'undefined') {
  const resume = () => {
    resumeAudioContext();
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'running') {
      window.removeEventListener('click', resume);
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    }
  };
  window.addEventListener('click', resume);
  window.addEventListener('pointerdown', resume, { passive: true });
  window.addEventListener('keydown', resume);
}

export const playMechanicalTick = (volume = 0.04) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
};

export const playScrollTick = (volume = 0.0035) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.006);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.006);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.01);
  } catch (e) {}
};

export const playDigitalChime = (volume = 0.04) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major chord
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.025);
      
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(volume, now + i * 0.025 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.025 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.025);
      osc.stop(now + i * 0.025 + 0.35);
    });
  } catch (e) {}
};

export const playSectionChime = (freq: number, volume = 0.015) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + 0.05);
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {}
};

// Short cute alien blip — descending sine chirp (800Hz → 200Hz)
export const playAlienBlip = (volume = 0.025) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch (e) {}
};

// Deep ambient space hum — low-frequency drone that loops continuously.
// Returns a stop function. Call it to fade out and stop.
export const startSpaceHum = (volume = 0.008) => {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  try {
    const now = ctx.currentTime;

    // Two detuned oscillators for a rich, slightly warbling drone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(48, now);
    osc1.frequency.linearRampToValueAtTime(50, now + 4);
    osc1.frequency.linearRampToValueAtTime(46, now + 8);
    osc1.frequency.linearRampToValueAtTime(48, now + 12); // slow LFO-style wobble

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(52, now);
    osc2.frequency.linearRampToValueAtTime(49, now + 3.5);
    osc2.frequency.linearRampToValueAtTime(53, now + 7);
    osc2.frequency.linearRampToValueAtTime(51, now + 12);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 1.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    // Return a stop function that fades out gently
    return () => {
      try {
        const stopTime = ctx.currentTime;
        gain.gain.cancelScheduledValues(stopTime);
        gain.gain.setValueAtTime(gain.gain.value, stopTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stopTime + 0.8);
        osc1.stop(stopTime + 1);
        osc2.stop(stopTime + 1);
      } catch (e) {}
    };
  } catch (e) {
    return () => {};
  }
};
