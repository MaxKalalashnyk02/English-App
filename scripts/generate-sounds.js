#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const OUT_DIR = path.join(__dirname, '..', 'assets', 'sounds');

function writeWav(fileName, samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  samples.forEach((s, i) => {
    const clamped = Math.max(-1, Math.min(1, s));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  });
  fs.writeFileSync(path.join(OUT_DIR, fileName), buffer);
}

function welcomeChime() {
  const length = Math.floor(SAMPLE_RATE * 2.8);
  const dry = new Array(length).fill(0);
  const notes = [
    { freq: 523.25, start: 0.0, gain: 0.9 },
    { freq: 659.25, start: 0.07, gain: 0.8 },
    { freq: 783.99, start: 0.14, gain: 0.75 },
    { freq: 987.77, start: 0.21, gain: 0.6 },
    { freq: 1318.51, start: 0.3, gain: 0.45 },
  ];

  for (const { freq, start, gain } of notes) {
    const offset = Math.floor(start * SAMPLE_RATE);
    for (let i = 0; offset + i < length; i++) {
      const t = i / SAMPLE_RATE;
      const attack = 1 - Math.exp(-t / 0.008);
      const tone =
        (Math.sin(2 * Math.PI * freq * t) + Math.sin(2 * Math.PI * freq * 1.0025 * t)) *
          0.5 *
          Math.exp(-t * 1.6) +
        Math.sin(2 * Math.PI * freq * 2 * t) * Math.exp(-t * 4) * 0.18 +
        Math.sin(2 * Math.PI * freq * 3.01 * t) * Math.exp(-t * 9) * 0.06;
      dry[offset + i] += tone * attack * gain;
    }
  }

  const wet = new Array(length).fill(0);
  for (const delayMs of [37, 53, 71, 97]) {
    const delay = Math.floor((delayMs / 1000) * SAMPLE_RATE);
    const line = new Array(length).fill(0);
    for (let i = 0; i < length; i++) {
      line[i] = dry[i] + (i >= delay ? line[i - delay] * 0.55 : 0);
      wet[i] += line[i] * 0.12;
    }
  }

  const mixed = dry.map((s, i) => s + wet[i]);
  const peak = mixed.reduce((max, s) => Math.max(max, Math.abs(s)), 0);
  const fadeStart = length - Math.floor(SAMPLE_RATE * 0.6);
  return mixed.map((s, i) => {
    const fade = i > fadeStart ? 1 - (i - fadeStart) / (length - fadeStart) : 1;
    return (s / peak) * 0.5 * fade;
  });
}

function selectTap() {
  const length = Math.floor(SAMPLE_RATE * 0.35);
  const samples = new Array(length);
  const freq = 783.99;
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const attack = 1 - Math.exp(-t / 0.003);
    const tone =
      Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 14) +
      Math.sin(2 * Math.PI * freq * 2 * t) * Math.exp(-t * 26) * 0.25;
    samples[i] = tone * attack * 0.35;
  }
  return samples;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
writeWav('welcome-chime.wav', welcomeChime());
writeWav('select.wav', selectTap());
console.log(`Sounds written to ${OUT_DIR}`);
