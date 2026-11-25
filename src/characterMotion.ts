import { Skia } from '@shopify/react-native-skia';

import type { FriendId, Pose } from './conversation';

// 원본 한 장(512×768)에서 모두 같은 사각형을 잘라 네 자세를 2×2로 담았다.
export const crop = { x: 80, y: 144, width: 368, height: 416 };
export const frame: Record<Pose, [number, number]> = {
  listen: [0, 0], wave: [crop.width, 0],
  apple: [0, crop.height], relax: [crop.width, crop.height],
};

type Point = [number, number];
type Rig = {
  cycleMs: number;
  feet: Point;
  shadowWidth: number;
  neck: Point;
  headRadius: number;
  tilt: number;
  nod: number;
  sway: number;
  breath: number;
  waveHand: Point;
  appleHand: Point;
  tail?: { tip: Point; swing: Point; beats: number };
};

export const rigs: Record<FriendId, Rig> = {
  hodam: {
    cycleMs: 14300, feet: [253, 509], shadowWidth: 158, neck: [264, 350], headRadius: 110,
    tilt: 0.046, nod: 1.7, sway: 2.5, breath: 3.8, waveHand: [345, 349], appleHand: [360, 342],
    tail: { tip: [149, 349], swing: [10, 4], beats: 5 },
  },
  boksil: {
    cycleMs: 11200, feet: [275, 525], shadowWidth: 190, neck: [264, 346], headRadius: 114,
    tilt: -0.078, nod: 2.8, sway: 3, breath: 2.6, waveHand: [370, 328], appleHand: [381, 311],
    tail: { tip: [175, 392], swing: [12, -7], beats: 11 },
  },
  dodam: {
    cycleMs: 13500, feet: [270, 495], shadowWidth: 250, neck: [245, 328], headRadius: 97,
    tilt: -0.034, nod: 5.5, sway: 1.8, breath: 2.5, waveHand: [354, 295], appleHand: [394, 322],
  },
  boksoon: {
    cycleMs: 14800, feet: [257, 538], shadowWidth: 143, neck: [252, 290], headRadius: 78,
    tilt: 0.039, nod: 3.4, sway: 3.6, breath: 3.3, waveHand: [184, 293], appleHand: [363, 288],
  },
  deoksu: {
    cycleMs: 16800, feet: [274, 520], shadowWidth: 161, neck: [277, 290], headRadius: 80,
    tilt: -0.065, nod: 3.3, sway: -3.2, breath: 2.3, waveHand: [358, 293], appleHand: [369, 273],
  },
};

// 발에서 목으로 갈수록 움직임을 키우고, 꼬리 끝과 손 주변만 부드럽게 따라오게 한다.
const source = Skia.RuntimeEffect.Make(`
  uniform shader poses;
  uniform float2 tile, origin, feet, neck;
  uniform float headRadius, lean, rise, angle, nod;
  uniform float2 tailTip, tailMove, hand, handMove;

  float influence(float2 delta, float2 radius) {
    return 1.0 - smoothstep(0.30, 1.0, length(delta / radius));
  }

  half4 main(float2 local) {
    float2 p = local + origin;
    float upper = smoothstep(0.0, 1.0, (feet.y - p.y) / (feet.y - neck.y));
    p.x -= lean * upper;
    p.y += rise * upper;

    float2 relative = p - neck;
    float head = (1.0 - smoothstep(-10.0, 35.0, relative.y))
               * (1.0 - smoothstep(headRadius - 18.0, headRadius + 12.0, abs(relative.x)));
    p -= head * (float2(-relative.y, relative.x) * angle + float2(0.0, nod));
    p -= tailMove * influence(p - tailTip, float2(43.0, 83.0));
    p -= handMove * influence(p - hand, float2(49.0, 67.0));
    return poses.eval(tile + p - origin);
  }
`);
if (!source) throw new Error('캐릭터 움직임을 준비할 수 없습니다.');
export const characterShader = source;
