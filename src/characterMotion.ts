import type { FriendId, Pose } from './conversation';

export const crop = { x: 80, y: 144, width: 368, height: 416 };
const poseRow: Record<Pose, number> = { listen: 0, wave: 1, apple: 2, relax: 3 };
type Point = [number, number];
// 인사·사과 자세에서 어깨 앞부분은 고정하고 팔꿈치를 축으로 손을 움직인다.
type ArmJoints = [shoulderX: number, shoulderY: number, elbowX: number, elbowY: number];
type Rig = {
  cycleMs: number; feet: Point; shadowWidth: number;
  headCenters: Record<Pose, Point>; headSize: Point;
  tilt: number; nod: number; sway: number; breath: number;
  arms: { wave: ArmJoints; apple: ArmJoints };
  tail?: { root: Point; angle: number; beats: number };
};

export const rigs: Record<FriendId, Rig> = {
  hodam: {
    cycleMs: 14300, feet: [253, 509], shadowWidth: 158,
    headCenters: { listen: [191, 151], wave: [168, 150], apple: [192, 150], relax: [185, 151] },
    headSize: [80, 66], tilt: 0.038, nod: 1.6, sway: 2.5, breath: 3.8,
    arms: { wave: [216, 222, 238, 247], apple: [231, 226, 256, 248] },
    tail: { root: [89, 313], angle: 0.095, beats: 5 },
  },
  boksil: {
    cycleMs: 11200, feet: [275, 525], shadowWidth: 190,
    headCenters: { listen: [191, 140], wave: [185, 141], apple: [192, 134], relax: [194, 139] },
    headSize: [78, 77], tilt: -0.055, nod: 2.4, sway: 3, breath: 2.6,
    arms: { wave: [257, 229, 274, 236], apple: [260, 230, 281, 238] },
    tail: { root: [112, 321], angle: 0.145, beats: 11 },
  },
  dodam: {
    cycleMs: 13500, feet: [270, 495], shadowWidth: 250,
    headCenters: { listen: [172, 138], wave: [155, 133], apple: [161, 136], relax: [164, 135] },
    headSize: [84, 71], tilt: -0.032, nod: 3.7, sway: 1.8, breath: 2.5,
    arms: { wave: [249, 178, 269, 235], apple: [256, 178, 279, 244] },
  },
  boksoon: {
    cycleMs: 14800, feet: [257, 538], shadowWidth: 143,
    headCenters: { listen: [179, 104], wave: [172, 103], apple: [179, 104], relax: [172, 104] },
    headSize: [64, 54], tilt: 0.038, nod: 2.8, sway: 3.6, breath: 3.3,
    arms: { wave: [139, 155, 117, 196], apple: [241, 157, 258, 198] },
  },
  deoksu: {
    cycleMs: 16800, feet: [274, 520], shadowWidth: 161,
    headCenters: { listen: [201, 100], wave: [195, 101], apple: [201, 99], relax: [201, 99] },
    headSize: [66, 59], tilt: -0.05, nod: 2.9, sway: -3.2, breath: 2.3,
    arms: { wave: [234, 155, 257, 201], apple: [239, 155, 260, 200] },
  },
};

export function characterUniforms(friend: FriendId, pose: Pose, tick: number, focus: number) {
  'worklet';
  const rig = rigs[friend];
  const elapsedMs = tick * 1000 / 24;
  const t = 2 * Math.PI * (elapsedMs % rig.cycleMs) / rig.cycleMs;
  const breath = Math.sin(3 * t);
  const glance = 0.7 * Math.sin(2 * t) + 0.3 * Math.sin(5 * t);
  const gesturing = pose === 'wave' || pose === 'apple';
  let armAngle = 0;
  let reach = 0;
  if (pose === 'wave') {
    // 귀 옆의 손은 얼굴 바깥쪽으로 흔들었다가 제자리로 돌아온다.
    const outward = Math.sign(rig.arms.wave[2] - rig.headCenters.wave[0]);
    const wave = 0.5 * (1 - Math.cos(12 * t)) * Math.max(0, Math.cos(2 * t));
    armAngle = outward * 0.17 * wave;
  } else if (pose === 'apple') {
    armAngle = 0.036 * breath;
    reach = 0.017 * Math.sin(2 * t);
  }
  const tail = rig.tail;
  return {
    tileSize: [crop.width, crop.height], row: poseRow[pose],
    foot: [rig.feet[0] - crop.x, rig.feet[1] - crop.y],
    face: rig.headCenters[pose], faceSize: rig.headSize,
    lean: rig.sway * glance, rise: rig.breath * breath,
    tilt: rig.tilt * (glance + 0.65 * focus), nod: rig.nod * Math.sin(4 * t) + 1.5 * focus,
    yaw: 0.095 * glance + 0.028 * focus,
    hasArm: Number(gesturing), joints: pose === 'apple' ? rig.arms.apple : rig.arms.wave,
    armAngle, reach,
    hasSupport: Number(pose === 'apple' || (friend === 'dodam' && pose === 'listen')),
    hasTail: Number(Boolean(tail)), tailRoot: tail?.root ?? [0, 0],
    tailAngle: tail ? tail.angle * Math.sin(tail.beats * t) * (0.78 + 0.22 * Math.cos(t) + 0.4 * focus) : 0,
  };
}
