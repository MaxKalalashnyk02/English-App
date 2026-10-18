# English-App

An Expo (SDK 57) app for learning English with a personal tutor.

## Run

```bash
npm install
npx expo run:ios      # build and install the development build (needed after native changes)
npx expo start        # start the dev server
```

## Check

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

## Generators

| Command | Output |
|---|---|
| `node scripts/generate-avatars.js` | Tutor portraits → `src/constants/avatars.ts` |
| `node scripts/generate-glyph-paths.js` | Painted titles and localized "Welcome" → `src/constants/painted-words.ts` |
| `node scripts/generate-sounds.js` | UI sounds → `assets/sounds/` |
| `node scripts/generate-logo-ai.mjs [count] [--openai]` | Logo options → `assets/images/logo-realistic-*` |

Realistic 3D tutor models: see `docs/3d-tutors.md`.
