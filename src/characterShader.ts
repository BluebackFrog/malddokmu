import { Skia } from '@shopify/react-native-skia';

// 각 행은 한 자세다. 열은 그리는 순서대로 꼬리, 몸, 얼굴·머리카락, 받친 손, 움직이는 팔·소품이다.
const source = Skia.RuntimeEffect.Make(`
  uniform shader parts;
  uniform float2 tileSize, foot, face, faceSize, tailRoot;
  uniform float4 joints;
  uniform float row, lean, rise, tilt, nod, yaw, hasArm, armAngle, reach, hasSupport, hasTail, tailAngle;

  half4 part(float column, float2 p) {
    float2 uv = clamp(p, float2(0.5), tileSize - 0.5);
    return parts.eval(float2(column, row) * tileSize + uv);
  }
  half4 over(half4 front, half4 back) {
    return front + (1.0 - front.a) * back;
  }
  float2 unrotate(float2 p, float2 pivot, float angle) {
    float2 d = p - pivot;
    float c = cos(angle), s = sin(angle);
    return pivot + float2(c * d.x + s * d.y, c * d.y - s * d.x);
  }

  half4 main(float2 local) {
    float2 neck = face + float2(0.0, faceSize.y * 0.79);
    float upper = smoothstep(0.0, foot.y - neck.y, foot.y - local.y);
    float2 body = local - upper * float2(lean, -rise);
    float2 chestCenter = mix(neck, foot, 0.42);
    float2 chestUv = (body - chestCenter) / float2(faceSize.x, 0.52 * (foot.y - neck.y));
    float chestDepth = smoothstep(0.0, 1.0, 1.0 - dot(chestUv, chestUv));
    body.x -= 0.18 * yaw * faceSize.x * chestDepth * upper;
    half4 back = half4(0);
    if (hasTail > 0.5) {
      float bend = smoothstep(4.0, 45.0, distance(body, tailRoot));
      back = part(0.0, unrotate(body, tailRoot, tailAngle * bend));
    }

    float2 head = unrotate(body - float2(0.0, nod), neck, tilt);
    float2 uv = (head - face) / faceSize;
    // 뺨과 코는 둥근 면의 앞쪽에 있다고 보고, 고개가 돌아갈 때 윤곽보다 조금 더 옮긴다.
    float relief = smoothstep(0.0, 1.0, 1.0 - dot(uv, uv));
    head.x = face.x + (head.x - face.x) / cos(yaw) - yaw * faceSize.x * 0.57 * relief;
    head.y -= 0.17 * nod * relief;
    half4 faceInk = part(2.0, head);
    float light = 1.0 + 0.025 * relief - 0.022 * clamp(uv.x + 0.6 * uv.y - yaw * 2.0, -1.0, 1.0);
    faceInk.rgb = min(faceInk.aaa, faceInk.rgb * light);

    half4 torso = part(1.0, body);
    // 턱 그림자는 옷에만 얹는다. 손짓이 얼굴의 색이나 좌표를 바꾸지 않는다.
    float chinShadow = part(2.0, head - float2(1.0, 3.2)).a;
    torso.rgb = min(torso.aaa, torso.rgb * (1.0 + 0.016 * chestDepth - 0.095 * chinShadow));
    half4 result = over(faceInk, over(torso, back));
    if (hasSupport > 0.5) {
      result = over(part(3.0, body), result);
    }
    if (hasArm > 0.5) {
      float jointWeight = smoothstep(3.0, 40.0, distance(body, joints.xy));
      float2 arm = unrotate(body, joints.zw, armAngle * jointWeight);
      arm = joints.xy + (arm - joints.xy) / (1.0 + reach * jointWeight);
      result = over(part(4.0, arm), result);
    }
    return result;
  }
`);
if (!source) throw new Error('캐릭터 움직임을 준비할 수 없습니다.');
export const characterShader = source;
