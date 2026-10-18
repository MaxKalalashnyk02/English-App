import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber/native';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import type { ViewStyle } from 'react-native';
import { Bone, Box3, Mesh, Object3D, PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';

type LivingTutorProps = {
  source: number;
  style?: ViewStyle;
};

export function LivingTutor({ source, style }: LivingTutorProps) {
  return (
    <Canvas
      style={style}
      camera={{ fov: 24, near: 0.05, far: 20, position: [0, 1.5, 1] }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
      <hemisphereLight args={[0xfff4e8, 0x1a1a22, 0.9]} />
      <directionalLight position={[-1.2, 1.9, 2]} intensity={2.6} color={0xfff1e0} />
      <directionalLight position={[1.6, 1.2, 1.4]} intensity={0.8} color={0xdfe8ff} />
      <directionalLight position={[0, 2.2, -2]} intensity={1.8} />
      <Suspense fallback={null}>
        <TutorModel source={source} />
      </Suspense>
    </Canvas>
  );
}

const BONE_NAMES = {
  chest: [/^(mixamorig:?)?spine2$/i, /upper_?chest/i, /^(mixamorig:?)?chest$/i, /spine_?03/i],
  neck: [/^(mixamorig:?)?neck$/i, /neck_?01/i],
  head: [/^(mixamorig:?)?head$/i],
  leftShoulder: [/^(mixamorig:?)?leftshoulder$/i, /clavicle_l/i],
  rightShoulder: [/^(mixamorig:?)?rightshoulder$/i, /clavicle_r/i],
  leftArm: [/^(mixamorig:?)?leftarm$/i, /leftupperarm/i, /upperarm_l/i],
  rightArm: [/^(mixamorig:?)?rightarm$/i, /rightupperarm/i, /upperarm_r/i],
  leftForeArm: [/^(mixamorig:?)?leftforearm$/i, /leftlowerarm/i, /lowerarm_l/i],
  rightForeArm: [/^(mixamorig:?)?rightforearm$/i, /rightlowerarm/i, /lowerarm_r/i],
} as const;

type Rig = { -readonly [K in keyof typeof BONE_NAMES]?: Bone };

function findRig(root: Object3D): Rig {
  const bones: Bone[] = [];
  root.traverse((o) => {
    if ((o as Bone).isBone) bones.push(o as Bone);
  });
  const rig: Rig = {};
  for (const key of Object.keys(BONE_NAMES) as (keyof typeof BONE_NAMES)[]) {
    for (const pattern of BONE_NAMES[key]) {
      const bone = bones.find((b) => pattern.test(b.name));
      if (bone) {
        rig[key] = bone;
        break;
      }
    }
  }
  return rig;
}

function collectMorphMeshes(root: Object3D): Mesh[] {
  const meshes: Mesh[] = [];
  root.traverse((o) => {
    const mesh = o as Mesh;
    if (mesh.isMesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) meshes.push(mesh);
  });
  return meshes;
}

function setMorph(meshes: Mesh[], name: string, value: number) {
  for (const mesh of meshes) {
    const index = mesh.morphTargetDictionary![name];
    if (index !== undefined) mesh.morphTargetInfluences![index] = value;
  }
}

const tmpA = new Vector3();
const tmpB = new Vector3();
const tmpQ1 = new Quaternion();
const tmpQ2 = new Quaternion();
const tmpQ3 = new Quaternion();

function rotateWorld(bone: Bone, axis: Vector3, angle: number) {
  if (!bone.parent) return;
  const parentQ = bone.parent.getWorldQuaternion(tmpQ1);
  const delta = tmpQ2.setFromAxisAngle(axis, angle);
  const local = tmpQ3.copy(parentQ).invert().multiply(delta).multiply(parentQ);
  bone.quaternion.premultiply(local);
  bone.updateMatrixWorld(true);
}

function relaxArm(arm: Bone | undefined, foreArm: Bone | undefined) {
  if (!arm || !foreArm || !arm.parent) return;
  arm.updateMatrixWorld(true);
  const current = foreArm.getWorldPosition(tmpA).sub(arm.getWorldPosition(tmpB)).normalize();
  const target = new Vector3(Math.sign(current.x) * 0.2, -1, 0.06).normalize();
  const swing = new Quaternion().setFromUnitVectors(current, target);
  const armWorld = arm.getWorldQuaternion(new Quaternion());
  const parentWorld = arm.parent.getWorldQuaternion(new Quaternion());
  arm.quaternion.copy(parentWorld.invert().multiply(swing.multiply(armWorld)));
  arm.updateMatrixWorld(true);
}

const X = new Vector3(1, 0, 0);
const Y = new Vector3(0, 1, 0);
const Z = new Vector3(0, 0, 1);

function TutorModel({ source }: { source: number }) {
  const gltf = useLoader(GLTFLoader, source as unknown as string);
  const scene = useMemo(() => cloneSkinned(gltf.scene), [gltf.scene]);
  const rig = useMemo(() => findRig(scene), [scene]);
  const morphMeshes = useMemo(() => collectMorphMeshes(scene), [scene]);
  const camera = useThree((state) => state.camera) as PerspectiveCamera;

  const base = useRef(new Map<Bone, Quaternion>());
  const life = useRef({
    nextBlink: 1.5,
    blinkStart: -1,
    doubleBlink: false,
    nextGlance: 1,
    gaze: new Vector3(),
    gazeTarget: new Vector3(),
  });

  useLayoutEffect(() => {
    relaxArm(rig.leftArm, rig.leftForeArm);
    relaxArm(rig.rightArm, rig.rightForeArm);

    for (const bone of [rig.chest, rig.neck, rig.head, rig.leftShoulder, rig.rightShoulder]) {
      if (bone) base.current.set(bone, bone.quaternion.clone());
    }

    scene.updateMatrixWorld(true);
    const head = rig.head
      ? rig.head.getWorldPosition(new Vector3())
      : new Box3().setFromObject(scene).getCenter(new Vector3()).setY(1.6);
    const focus = head.clone().add(new Vector3(0, -0.1, 0));
    camera.position.set(focus.x, focus.y + 0.03, focus.z + 1.05);
    camera.lookAt(focus);
    camera.updateProjectionMatrix();
  }, [scene, rig, camera]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = life.current;

    for (const [bone, rest] of base.current) bone.quaternion.copy(rest);

    const breath = Math.sin((t * Math.PI * 2) / 4.3);
    if (rig.chest) rotateWorld(rig.chest, X, -0.018 * breath);
    if (rig.neck) rotateWorld(rig.neck, X, 0.012 * breath);
    if (rig.leftShoulder) rotateWorld(rig.leftShoulder, Z, 0.012 * (breath + 1));
    if (rig.rightShoulder) rotateWorld(rig.rightShoulder, Z, -0.012 * (breath + 1));

    if (rig.head) {
      rotateWorld(rig.head, Y, 0.045 * Math.sin(t * 0.31) + 0.02 * Math.sin(t * 0.83 + 1.3));
      rotateWorld(rig.head, X, 0.025 * Math.sin(t * 0.27 + 0.6) + 0.01 * Math.sin(t * 0.71));
      rotateWorld(rig.head, Z, 0.018 * Math.sin(t * 0.23 + 2.1));
    }

    if (t >= s.nextBlink && s.blinkStart < 0) {
      s.blinkStart = t;
      s.doubleBlink = Math.random() < 0.15;
    }
    let blink = 0;
    if (s.blinkStart >= 0) {
      const p = (t - s.blinkStart) / 0.15;
      blink = p < 0.45 ? p / 0.45 : Math.max(0, 1 - (p - 0.45) / 0.55);
      if (p >= 1) {
        s.blinkStart = s.doubleBlink ? t + 0.08 : -1;
        s.nextBlink = s.doubleBlink ? t + 0.08 : t + 2 + Math.random() * 4;
        s.doubleBlink = false;
      }
    }
    setMorph(morphMeshes, 'eyeBlinkLeft', blink);
    setMorph(morphMeshes, 'eyeBlinkRight', blink);

    if (t >= s.nextGlance) {
      const far = Math.random() < 0.3;
      s.gazeTarget.set((Math.random() * 2 - 1) * (far ? 1 : 0.35), (Math.random() * 2 - 1) * 0.5, 0);
      s.nextGlance = t + 0.8 + Math.random() * 2.2;
    }
    s.gaze.lerp(s.gazeTarget, 0.25);
    const look = 0.35;
    const gx = s.gaze.x;
    const gy = s.gaze.y;
    setMorph(morphMeshes, 'eyeLookOutLeft', Math.max(0, gx) * look);
    setMorph(morphMeshes, 'eyeLookInRight', Math.max(0, gx) * look);
    setMorph(morphMeshes, 'eyeLookInLeft', Math.max(0, -gx) * look);
    setMorph(morphMeshes, 'eyeLookOutRight', Math.max(0, -gx) * look);
    setMorph(morphMeshes, 'eyeLookUpLeft', Math.max(0, gy) * look);
    setMorph(morphMeshes, 'eyeLookUpRight', Math.max(0, gy) * look);
    setMorph(morphMeshes, 'eyeLookDownLeft', Math.max(0, -gy) * look);
    setMorph(morphMeshes, 'eyeLookDownRight', Math.max(0, -gy) * look);

    const smile = 0.14 + 0.03 * Math.sin(t * 0.4);
    setMorph(morphMeshes, 'mouthSmileLeft', smile);
    setMorph(morphMeshes, 'mouthSmileRight', smile);
  });

  return <primitive object={scene} />;
}
