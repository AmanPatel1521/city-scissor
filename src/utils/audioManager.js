// Web Audio API Sound Synthesizer for Scissor Snips, UI Clicks, and Ambient Lounge Music

class SalonAudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingAmbient = false;
    this.hasUnlocked = false;
    this.ambientTimer = null;
    this.ambientNodes = [];
    this.masterGain = null;

    if (typeof window !== 'undefined') {
      const handleInitialUnlock = async () => {
        if (this.hasUnlocked) return;
        this.hasUnlocked = true;
        await this.ensureContextRunning();
        if (!this.isMuted) {
          this.playAmbientLounge();
        }
      };

      // One-time unlock on first real user gesture
      const events = ['mousedown', 'pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'wheel'];
      events.forEach(evt => {
        window.addEventListener(evt, handleInitialUnlock, { passive: true, capture: true, once: true });
      });

      window.addEventListener('load', handleInitialUnlock, { once: true });
    }
  }

  getOrCreateContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.ctx.onstatechange = () => {
          if (this.ctx && this.ctx.state === 'running' && !this.isMuted && !this.isPlayingAmbient) {
            this.playAmbientLounge();
          }
        };
      }
    }
    return this.ctx;
  }

  async ensureContextRunning() {
    const ctx = this.getOrCreateContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {}
    }
  }

  init() {
    this.ensureContextRunning();
  }

  // Force enable / unmute audio explicitly
  unmute() {
    this.isMuted = false;
    const ctx = this.getOrCreateContext();
    if (!ctx) return true;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.setValueAtTime(1.0, ctx.currentTime);
    }

    this.playAmbientLounge();
    return true;
  }

  // Mute audio explicitly
  mute() {
    this.isMuted = true;
    const ctx = this.getOrCreateContext();
    if (this.masterGain && ctx) {
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    }
    this.stopAmbientLounge();
    return false;
  }

  // Robust Toggle Mute
  toggleMute() {
    if (this.isMuted) {
      return this.unmute();
    } else {
      return this.mute();
    }
  }

  // Realistic, Crisp, Loud Metallic Scissor "SCHIK-SNIP!" Sound Synthesis
  async playScissorSnip(pitch = 1.0) {
    if (this.isMuted) return;
    const ctx = this.getOrCreateContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {}
    }

    try {
      const now = ctx.currentTime;

      // 1. Blade Friction White Noise "SCHIK" Burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Bandpass filter centered around 3800Hz for sharp Japanese steel edge
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3800 * pitch, now);
      filter.Q.setValueAtTime(4.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.exponentialRampToValueAtTime(1.0, now + 0.008);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.12);

      // 2. High-Frequency Metallic Resonant Ring (Titanium Pivot)
      const osc1 = ctx.createOscillator();
      const osc1Gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(5400 * pitch, now);
      osc1.frequency.exponentialRampToValueAtTime(2800 * pitch, now + 0.06);

      osc1Gain.gain.setValueAtTime(0.55, now);
      osc1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc1.connect(osc1Gain);
      osc1Gain.connect(this.masterGain);

      osc1.start(now);
      osc1.stop(now + 0.09);

      // 3. Low Mechanical Contact "Snap"
      const osc2 = ctx.createOscillator();
      const osc2Gain = ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(950 * pitch, now);
      osc2.frequency.exponentialRampToValueAtTime(150 * pitch, now + 0.045);

      osc2Gain.gain.setValueAtTime(0.6, now);
      osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc2.connect(osc2Gain);
      osc2Gain.connect(this.masterGain);

      osc2.start(now);
      osc2.stop(now + 0.06);

    } catch (e) {
      // ignore
    }
  }

  // Subtle UI click / tactile snap
  async playClick() {
    if (this.isMuted) return;
    const ctx = this.getOrCreateContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {}
    }

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // ignore
    }
  }

  // Atmospheric Chill Lounge Chord Progression Synthesizer
  playAmbientLounge() {
    const ctx = this.getOrCreateContext();
    if (!ctx || this.isMuted || ctx.state !== 'running') return;

    if (this.isPlayingAmbient) return;
    this.isPlayingAmbient = true;
    this.ambientNodes = [];

    const chordFrequencies = [
      [185.00, 277.18, 369.99, 440.00, 523.25], // F#m9
      [146.83, 220.00, 293.66, 369.99, 440.00], // Dmaj9
      [220.00, 277.18, 329.63, 440.00, 554.37], // Aadd9
      [138.59, 207.65, 277.18, 329.63, 415.30]  // C#m7
    ];

    let chordIndex = 0;
    const playChordStep = () => {
      if (!this.isPlayingAmbient || this.isMuted || !this.ctx || this.ctx.state !== 'running') {
        this.isPlayingAmbient = false;
        return;
      }

      const freqs = chordFrequencies[chordIndex % chordFrequencies.length];
      chordIndex++;

      const now = this.ctx.currentTime;
      const stepDuration = 6.0;

      freqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750 + i * 150, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.07 / (i + 1), now + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + stepDuration + 0.1);
        this.ambientNodes.push(osc);
      });

      this.ambientTimer = setTimeout(playChordStep, (stepDuration - 0.8) * 1000);
    };

    playChordStep();
  }

  stopAmbientLounge() {
    this.isPlayingAmbient = false;
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
    this.ambientNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {}
    });
    this.ambientNodes = [];
  }
}

export const audioManager = new SalonAudioManager();
