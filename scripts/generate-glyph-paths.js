#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const FONT_DIR = path.join(__dirname, '..', 'node_modules', '@expo-google-fonts', 'inter');
const OUT_FILE = path.join(__dirname, '..', 'src', 'constants', 'painted-words.ts');

const UNITS = 100;

const WORDS = {
  englishApp: { text: 'English-App', font: '600SemiBold/Inter_600SemiBold.ttf' },
  chooseTutor: { text: 'Choose your tutor', font: '700Bold/Inter_700Bold.ttf' },
  secretTutors: { text: 'Premium tutors', font: '700Bold/Inter_700Bold.ttf' },
  whatYouLove: { text: 'What do you love?', font: '700Bold/Inter_700Bold.ttf' },
  tutorStyle: { text: "Your tutor's style", font: '700Bold/Inter_700Bold.ttf' },
  yourLevel: { text: 'Your English level', font: '700Bold/Inter_700Bold.ttf' },
};

const WELCOME_FONT = '700Bold/Inter_700Bold.ttf';
const WELCOME_COPY = require('../src/constants/welcome-i18n.json');

const round = (n) => Math.round(n * 100) / 100;

function loadFont(fontFile) {
  const file = fs.readFileSync(path.join(FONT_DIR, fontFile));
  return opentype.parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength));
}

function fontCovers(fontFile, text) {
  const font = loadFont(fontFile);
  return [...text].every((char) => char === ' ' || font.charToGlyph(char).index !== 0);
}

function cubicPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function quadPoint(p0, p1, p2, t) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

function toContours(commands) {
  const contours = [];
  let current = null;
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;

  for (const cmd of commands) {
    if (cmd.type === 'M') {
      current = { d: `M${round(cmd.x)} ${round(cmd.y)}`, length: 0 };
      contours.push(current);
      x = startX = cmd.x;
      y = startY = cmd.y;
    } else if (cmd.type === 'L') {
      current.d += `L${round(cmd.x)} ${round(cmd.y)}`;
      current.length += Math.hypot(cmd.x - x, cmd.y - y);
      x = cmd.x;
      y = cmd.y;
    } else if (cmd.type === 'C' || cmd.type === 'Q') {
      const steps = 16;
      let px = x;
      let py = y;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const nx =
          cmd.type === 'C'
            ? cubicPoint(x, cmd.x1, cmd.x2, cmd.x, t)
            : quadPoint(x, cmd.x1, cmd.x, t);
        const ny =
          cmd.type === 'C'
            ? cubicPoint(y, cmd.y1, cmd.y2, cmd.y, t)
            : quadPoint(y, cmd.y1, cmd.y, t);
        current.length += Math.hypot(nx - px, ny - py);
        px = nx;
        py = ny;
      }
      current.d +=
        cmd.type === 'C'
          ? `C${round(cmd.x1)} ${round(cmd.y1)} ${round(cmd.x2)} ${round(cmd.y2)} ${round(cmd.x)} ${round(cmd.y)}`
          : `Q${round(cmd.x1)} ${round(cmd.y1)} ${round(cmd.x)} ${round(cmd.y)}`;
      x = cmd.x;
      y = cmd.y;
    } else if (cmd.type === 'Z') {
      current.d += 'Z';
      current.length += Math.hypot(startX - x, startY - y);
      x = startX;
      y = startY;
    }
  }

  return contours.map((c) => ({ d: c.d, length: Math.ceil(c.length) }));
}

function buildWord({ text, font: fontFile }) {
  const font = loadFont(fontFile);
  const scale = UNITS / font.unitsPerEm;

  const chars = [...text].map((char) => font.charToGlyph(char));
  let cursor = 0;
  const glyphPaths = chars.map((glyph, i) => {
    const glyphPath = glyph.getPath(cursor, 0, UNITS);
    const next = chars[i + 1];
    cursor += (glyph.advanceWidth + (next ? font.getKerningValue(glyph, next) : 0)) * scale;
    return glyphPath;
  });

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const glyphs = [];

  for (const glyphPath of glyphPaths) {
    if (glyphPath.commands.length === 0) continue;
    const box = glyphPath.getBoundingBox();
    minX = Math.min(minX, box.x1);
    minY = Math.min(minY, box.y1);
    maxX = Math.max(maxX, box.x2);
    maxY = Math.max(maxY, box.y2);
    glyphs.push({ d: glyphPath.toPathData(2), contours: toContours(glyphPath.commands) });
  }

  const top =-font.ascender * scale;
  const bottom = -font.descender * scale;
  const pad = 2;

  return {
    viewBox: [round(minX - pad), round(top), round(maxX - minX + pad * 2), round(bottom - top)],
    glyphs,
  };
}

const output = Object.fromEntries(
  Object.entries(WORDS).map(([key, word]) => [key, buildWord(word)])
);

const welcomeByLanguage = {};
for (const [language, { welcome }] of Object.entries(WELCOME_COPY)) {
  if (fontCovers(WELCOME_FONT, welcome)) {
    welcomeByLanguage[language] = buildWord({ text: welcome, font: WELCOME_FONT });
  } else {
    console.log(`Skipping "${welcome}" (${language}): not covered by Inter, shown as text.`);
  }
}

fs.writeFileSync(
  OUT_FILE,
  `import type { PaintedWord } from '@/components/painted-text';\n\n` +
    `export const UNITS_PER_FONT_SIZE = ${UNITS};\n\n` +
    Object.entries(output)
      .map(([key, word]) => `export const ${key}: PaintedWord = ${JSON.stringify(word)};\n`)
      .join('\n') +
    `\nexport const WELCOME_BY_LANGUAGE: Record<string, PaintedWord> = ${JSON.stringify(welcomeByLanguage)};\n`
);
console.log(`Glyph paths written to ${OUT_FILE}`);
