import { BlurMask, Canvas, Group, ImageShader, Oval, Rect, Shader, useImage } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, AppState, PixelRatio, StyleSheet, View } from 'react-native';
import {
  cancelAnimation, ReduceMotion, useDerivedValue, useFrameCallback, useSharedValue, withTiming, type FrameInfo,
} from 'react-native-reanimated';

import { characterUniforms, crop, rigs } from './characterMotion';
import { characterShader } from './characterShader';
import { friends, type FriendId, type Pose } from './conversation';

type SceneProps = { friend: FriendId; pose: Pose; attentive: boolean; paused: boolean };

function useMotionEnabled() {
  const [reduced, setReduced] = useState(true);
  const [active, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    let readInitialSetting = true;
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      readInitialSetting = false;
      setReduced(value);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (readInitialSetting) setReduced(value);
    });
    const state = AppState.addEventListener('change', value => setActive(value === 'active'));
    return () => {
      readInitialSetting = false;
      motion.remove();
      state.remove();
    };
  }, []);
  return active && !reduced;
}

type CharacterProps = Omit<SceneProps, 'paused'> & {
  moving: boolean; scale: number; left: number; top: number;
};

function Character({ friend, pose, attentive, moving, scale, left, top }: CharacterProps) {
  const image = useImage(friends[friend].poses);
  const rig = rigs[friend];
  const tick = useSharedValue(0);
  const attention = useSharedValue(0);
  // 기기의 주사율과 관계없이 손그림은 초당 24장만 갱신한다.
  const clock = useFrameCallback(useCallback(({ timeSinceFirstFrame }: FrameInfo) => {
    'worklet';
    tick.set(Math.floor(timeSinceFirstFrame * 24 / 1000));
  }, [tick]), false);
  useEffect(() => {
    clock.setActive(moving);
    if (!moving) tick.set(0);
  }, [clock, moving, tick]);

  useEffect(() => {
    attention.value = moving
      ? withTiming(attentive ? 1 : 0, { duration: 320, reduceMotion: ReduceMotion.Never })
      : 0;
    return () => cancelAnimation(attention);
  }, [attention, attentive, moving]);

  const uniforms = useDerivedValue(() =>
    characterUniforms(friend, pose, tick.get(), attention.value)
  );

  // 원화 해상도로 그린 뒤 확대해 고밀도 화면에서도 매 프레임 같은 픽셀을 여러 번 계산하지 않는다.
  const magnification = Math.max(1, scale * PixelRatio.get());
  const drawingScale = scale / magnification;
  return (
    <Canvas colorSpace="srgb" style={{
      position: 'absolute', left, top, width: crop.width * drawingScale, height: crop.height * drawingScale,
      transformOrigin: 'top left', transform: [{ scale: magnification }],
    }}>
      {image && <Group transform={[{ scale: drawingScale }]}>
        <Oval x={rig.feet[0] - crop.x - rig.shadowWidth / 2} y={rig.feet[1] - crop.y - 5}
          width={rig.shadowWidth} height={11} color="rgba(64, 42, 26, 0.22)">
          <BlurMask blur={3} style="normal" />
        </Oval>
        <Rect x={0} y={0} width={crop.width} height={crop.height}>
          <Shader source={characterShader} uniforms={uniforms}>
            <ImageShader image={image} />
          </Shader>
        </Rect>
      </Group>}
    </Canvas>
  );
}

export function SceneArtwork({ friend, pose, attentive, paused }: SceneProps) {
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
  const motionEnabled = useMotionEnabled();
  const companion = friends[friend];
  const scale = Math.min(height / 768, width / crop.width);
  // 배경이 화면에 맞게 잘려도 발과 그림자는 원래 바닥 위치에 고정한다.
  const roomScale = Math.max(width / 512, height / 768);
  const [feetX, feetY] = rigs[friend].feet;
  const groundX = width / 2 + (feetX - 256) * roomScale;
  const groundY = height / 2 + (feetY - 384) * roomScale;
  const left = groundX - (feetX - crop.x) * scale;
  const top = groundY - (feetY - crop.y) * scale;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={companion.home + '의 ' + companion.name}
      pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}
      onLayout={({ nativeEvent }) => setSize(nativeEvent.layout)}>
      <Image source={companion.room} contentFit="cover" style={StyleSheet.absoluteFill} />
      {scale > 0 && <Character key={friend} friend={friend} pose={pose} attentive={attentive}
        moving={motionEnabled && !paused} scale={scale} left={left} top={top} />}
    </View>
  );
}
