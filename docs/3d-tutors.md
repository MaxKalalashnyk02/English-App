# Realistic 3D tutors — model spec

The app renders each tutor live on the phone and animates them itself (breathing, blinking,
eye movement, head motion and, later, lip-sync). For that to work, every model must meet
the requirements below.

## Where models come from

Use a realistic avatar creator that exports **GLB** with a **humanoid rig** and **ARKit
blendshapes**. Candidates to evaluate (check each one's commercial licence before shipping):

- **Avaturn** — realistic avatars from a selfie or editor; GLB export with ARKit blendshapes
  and visemes.
- **Avatar SDK MetaPerson** — realistic avatars, GLB export, commercial licensing.
- **Reallusion Character Creator** — highest quality and full control; export via its glTF/FBX
  pipeline. Paid desktop software.

Note: Ready Player Me shut down in January 2026, so don't use it.

## Requirements

| Requirement | Why |
|---|---|
| Format: `.glb` (binary glTF), **no Draco compression** | Draco needs a decoder that isn't available offline in the app |
| Humanoid skeleton with standard names: `Hips`, `Spine`, `Spine1`, `Spine2`, `Neck`, `Head`, `LeftShoulder`, `LeftArm`, `LeftForeArm` (and right side) — Mixamo-style | Breathing, head motion and arm posing find bones by these names |
| **ARKit 52 blendshapes** (`eyeBlinkLeft`, `eyeLookInLeft`, `jawOpen`, `mouthSmileLeft`, …) | Blinking, eye movement and expressions |
| **Visemes** (`viseme_aa`, `viseme_O`, `viseme_PP`, …, Oculus set) | Lip-sync when the tutor talks (step 2) |
| Facing **+Z**, Y up, real-world scale (metres, ~1.6–1.9 m tall) | Camera framing assumes this |
| Under ~15 MB, textures ≤ 2048 px, ~50–80k triangles | Smooth on mid-range phones |
| T-pose or A-pose is fine | The app relaxes the arms automatically |

## Adding a model

1. Save it as `assets/models/<id>.glb`: `oliver`, `sophie`, `leo` or `mia`.
2. In `src/constants/tutors.ts`, set that tutor's entry in `TUTOR_MODELS` to
   `require('@/assets/models/<id>.glb')`.
3. Open the app on a **physical device** (iOS simulators have unreliable OpenGL support).
