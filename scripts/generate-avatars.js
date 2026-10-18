#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '..', 'src', 'constants', 'avatars.ts');

const INK = '#1F1A17';

const K = 0.5523;

function ellipse(cx, cy, rx, ry) {
  const ox = rx * K;
  const oy = ry * K;
  return (
    `M${cx - rx} ${cy}` +
    `C${cx - rx} ${cy - oy} ${cx - ox} ${cy - ry} ${cx} ${cy - ry}` +
    `C${cx + ox} ${cy - ry} ${cx + rx} ${cy - oy} ${cx + rx} ${cy}` +
    `C${cx + rx} ${cy + oy} ${cx + ox} ${cy + ry} ${cx} ${cy + ry}` +
    `C${cx - ox} ${cy + ry} ${cx - rx} ${cy + oy} ${cx - rx} ${cy}Z`
  );
}

const fill = (d, color, extra = {}) => ({ d, fill: color, ...extra });
const line = (d, color = INK, width = 2.4) => ({ d, line: color, lineWidth: width });

const BACKDROP = ellipse(100, 100, 92, 92);
const NECK = 'M88 124L112 124L114 152L86 152Z';
const TORSO = 'M24 210C24 170 50 150 86 146L114 146C150 150 176 170 176 210Z';
const FACE = ellipse(100, 92, 34, 42);
const EARS = [ellipse(66, 96, 6, 10), ellipse(134, 96, 6, 10)];
const EYES = [ellipse(86, 97, 3.6, 4.4), ellipse(114, 97, 3.6, 4.4)];
const NOSE = 'M100 99Q96 109 101 111';
const SMILE = 'M89 119Q100 127 111 119';
const GLASSES = [
  ellipse(86, 97, 11.5, 9.5),
  ellipse(114, 97, 11.5, 9.5),
  'M97.5 95Q100 92.5 102.5 95',
  'M74.5 95L67 92',
  'M125.5 95L133 92',
];

function head({ skin, skinShade }) {
  return [
    fill(NECK, skinShade),
    fill(EARS[0], skin),
    fill(EARS[1], skin),
    fill(FACE, skin),
  ];
}

function features({ brows, browWidth = 2.6, smile = SMILE }) {
  return [
    line(brows[0], INK, browWidth),
    line(brows[1], INK, browWidth),
    fill(EYES[0], INK),
    fill(EYES[1], INK),
    line(NOSE, INK, 1.8),
    line(smile, INK, 2.4),
  ];
}

const oliver = {
  backdrop: '#22324A',
  elements: [
    fill(TORSO, '#2E3A4F'),
    ...head({ skin: '#F1C7A3', skinShade: '#DDAE88' }),
    fill('M86 146L100 174L114 146Z', '#F2F2F2'),
    fill('M97 150L103 150L105 178L100 184L95 178Z', '#9B2F35'),
    line('M86 146L95 180', '#1C2533', 2),
    line('M114 146L105 180', '#1C2533', 2),
    fill(
      'M64 92C61 60 78 46 102 46C126 46 141 60 136 90C133 78 127 70 118 66C105 72 86 70 75 64C70 72 66 80 64 92Z',
      '#5A4636'
    ),
    ...features({ brows: ['M77 84Q86 80 95 83', 'M105 83Q114 80 123 84'] }),
    ...GLASSES.map((d) => line(d, '#2B2B2B', 2.2)),
  ],
};

const sophie = {
  backdrop: '#3D3352',
  elements: [
    fill(ellipse(100, 44, 17, 15), '#1E1A1A'),
    fill(TORSO, '#6E8B74'),
    ...head({ skin: '#8D5A3B', skinShade: '#7A4C30' }),
    fill('M84 146Q100 166 116 146Z', '#F4E9DC'),
    line('M84 146L92 200', '#58705D', 2),
    line('M116 146L108 200', '#58705D', 2),
    fill(
      'M63 98C59 60 78 48 100 48C122 48 141 60 137 98C134 84 130 74 124 68C112 78 90 78 76 70C70 78 66 88 63 98Z',
      '#1E1A1A'
    ),
    ...features({ brows: ['M78 85Q86 81 94 84', 'M106 84Q114 81 122 85'] }),
    ...GLASSES.map((d) => line(d, '#C9A45C', 2.2)),
    fill(ellipse(66, 110, 3, 3), '#F4EFE6'),
    fill(ellipse(134, 110, 3, 3), '#F4EFE6'),
  ],
};

const leo = {
  backdrop: '#4A3226',
  elements: [
    fill(TORSO, '#26262B'),
    ...head({ skin: '#D9A27A', skinShade: '#C48B63' }),
    fill('M84 146Q100 160 116 146L118 152Q100 168 82 152Z', '#F2F2F2'),
    fill('M84 152L100 200L82 200L66 164Z', '#1B1B1F'),
    fill('M116 152L100 200L118 200L134 164Z', '#1B1B1F'),
    fill(
      'M70.5 106C75 122 87 131.5 100 131.5C113 131.5 125 122 129.5 106C124 119 113 126 100 126C87 126 76 119 70.5 106Z',
      '#3A2A20',
      { opacity: 0.28 }
    ),
    fill(
      'M66 86C61 58 78 38 104 38C121 36 137 47 139 63C140 72 138 80 135 88C131 73 121 64 107 66C96 59 84 66 76 63C70 70 68 77 66 86Z',
      '#2C1E16'
    ),
    ...features({
      brows: ['M76 84Q86 79 95 83', 'M105 83Q114 79 124 84'],
      browWidth: 3.4,
      smile: 'M90 119Q101 125 111 117',
    }),
  ],
};

const mia = {
  backdrop: '#4D2638',
  elements: [
    fill(
      'M58 100C52 60 74 40 100 40C126 40 148 60 142 100C146 130 152 160 142 184L112 184L112 132L88 132L88 184L58 184C48 160 54 130 58 100Z',
      '#B5562E'
    ),
    fill(TORSO, '#3B3F7A'),
    ...head({ skin: '#F3CDB0', skinShade: '#E2B596' }),
    fill('M86 146Q100 162 114 146Z', '#E2B596'),
    fill(
      'M64 98C61 58 82 44 104 46C126 48 141 64 136 98C131 80 119 66 100 63C88 71 75 82 64 98Z',
      '#C2633A'
    ),
    line('M77 85Q86 81 94 84', INK, 2.2),
    line('M106 84Q114 81 123 85', INK, 2.2),
    fill(EYES[0], INK),
    fill(EYES[1], INK),
    line('M82.5 94.5L79.5 92.5', INK, 1.6),
    line('M117.5 94.5L120.5 92.5', INK, 1.6),
    line(NOSE, INK, 1.8),
    fill('M90 118Q100 113 110 118Q100 127 90 118Z', '#C2455A'),
    fill(ellipse(66, 112, 4, 4), '#E3B341'),
    fill(ellipse(134, 112, 4, 4), '#E3B341'),
  ],
};

const valentina = {
  backdrop: '#6B1F3A',
  elements: [
    fill(
      'M56 100C50 58 74 38 100 38C126 38 150 58 144 100C150 132 154 164 142 186L112 186L112 132L88 132L88 186L58 186C46 164 50 132 56 100Z',
      '#1A0F0C'
    ),
    fill(TORSO, '#B8203F'),
    ...head({ skin: '#D9A07A', skinShade: '#C48A64' }),
    fill('M86 146Q100 160 114 146Z', '#C48A64'),
    fill(
      'M64 100C60 60 80 44 100 46C120 44 140 60 136 100C132 82 122 66 102 60C98 70 86 76 78 82C72 88 66 94 64 100Z',
      '#24150F'
    ),
    line('M77 85Q86 80 94 84', INK, 2.4),
    line('M106 84Q114 80 123 85', INK, 2.4),
    fill(EYES[0], INK),
    fill(EYES[1], INK),
    line('M82.5 94.5L79 92', INK, 1.8),
    line('M117.5 94.5L121 92', INK, 1.8),
    line(NOSE, INK, 1.8),
    fill('M90 118Q100 113 110 118Q100 127 90 118Z', '#A3243B'),
    line(ellipse(66, 114, 5, 6), '#E3B341', 1.6),
    line(ellipse(134, 114, 5, 6), '#E3B341', 1.6),
  ],
};

const NORDIC_EYES = '#3E6E9C';

const jack = {
  backdrop: '#2B3340',
  elements: [
    fill(TORSO, '#1E2A44'),
    ...head({ skin: '#EBC3A4', skinShade: '#D8AC8B' }),
    fill('M86 146L100 172L114 146Z', '#F4F4F4'),
    fill('M86 146L100 172L92 176L80 152Z', '#E6E6E6'),
    fill('M114 146L100 172L108 176L120 152Z', '#E6E6E6'),
    line('M84 150L96 200', '#141D30', 2.2),
    line('M116 150L104 200', '#141D30', 2.2),
    fill(
      'M70.5 106C75 122 87 131.5 100 131.5C113 131.5 125 122 129.5 106C124 119 113 126 100 126C87 126 76 119 70.5 106Z',
      '#3B2A1E',
      { opacity: 0.3 }
    ),
    fill(
      'M65 90C60 60 78 42 104 42C126 42 142 56 137 86C134 74 128 66 118 62C108 58 94 58 84 62C76 66 70 76 65 90Z',
      '#3E2B1F'
    ),
    line('M86 50Q104 44 124 52', '#5A4130', 2),
    line('M80 58Q100 51 128 60', '#5A4130', 1.6),
    ...features({
      brows: ['M76 84Q86 80 95 83', 'M105 82Q114 79 124 83'],
      browWidth: 3.2,
      smile: 'M91 119Q102 124 112 116',
    }),
  ],
};

function measure(d) {
  const tokens = d.match(/[MLQCZ]|-?\d*\.?\d+/g);
  let i = 0;
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let length = 0;
  const num = () => parseFloat(tokens[i++]);
  const sample = (fn) => {
    let px = x;
    let py = y;
    for (let s = 1; s <= 24; s++) {
      const [nx, ny] = fn(s / 24);
      length += Math.hypot(nx - px, ny - py);
      px = nx;
      py = ny;
    }
  };
  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === 'M') {
      x = sx = num();
      y = sy = num();
    } else if (cmd === 'L') {
      const nx = num();
      const ny = num();
      length += Math.hypot(nx - x, ny - y);
      x = nx;
      y = ny;
    } else if (cmd === 'Q') {
      const [x1, y1, nx, ny] = [num(), num(), num(), num()];
      const [x0, y0] = [x, y];
      sample((t) => [
        (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t * t * nx,
        (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t * t * ny,
      ]);
      x = nx;
      y = ny;
    } else if (cmd === 'C') {
      const [x1, y1, x2, y2, nx, ny] = [num(), num(), num(), num(), num(), num()];
      const [x0, y0] = [x, y];
      sample((t) => {
        const u = 1 - t;
        return [
          u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * nx,
          u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * ny,
        ];
      });
      x = nx;
      y = ny;
    } else if (cmd === 'Z') {
      length += Math.hypot(sx - x, sy - y);
      x = sx;
      y = sy;
    } else {
      throw new Error(`Unsupported path token "${cmd}" in: ${d}`);
    }
  }
  return Math.ceil(length);
}

function build(avatar) {
  return {
    backdrop: { d: BACKDROP, length: measure(BACKDROP), fill: avatar.backdrop },
    elements: avatar.elements.map((el) => ({ ...el, length: measure(el.d) })),
  };
}

const avatars = {
  oliver: build(oliver),
  sophie: build(sophie),
  leo: build(leo),
  mia: build(mia),
  valentina: build(valentina),
  jack: build(jack),
};

fs.writeFileSync(
  OUT_FILE,
  `import type { PaintedDrawingData } from '@/components/painted-drawing';\n` +
    `import type { TutorId } from '@/constants/tutors';\n\n` +
    `export const AVATAR_VIEWBOX = 200;\n\n` +
    `export const AVATARS: Record<TutorId, PaintedDrawingData> = ${JSON.stringify(avatars, null, 2)};\n`
);
console.log(`Avatars written to ${OUT_FILE}`);
