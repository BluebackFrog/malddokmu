import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { friends, type FriendId, type Pose } from './conversation';

const frames: Record<Pose, [number, number]> = {
  listen: [0, 0], wave: [1, 0], apple: [0, 1], relax: [1, 1],
};

export function SceneArtwork({ friend, pose }: { friend: FriendId; pose: Pose }) {
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
  const [column, row] = frames[pose];
  const frameWidth = Math.max(width, height * 2 / 3);
  // 웹 원본은 2×2 장면 시트다. 선택한 칸만 화면 가운데에 보이게 한다.
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={friends[friend].home + '의 ' + friends[friend].name}
      pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}
      onLayout={({ nativeEvent }) => setSize(nativeEvent.layout)}>
      {height > 0 && <Image source={friends[friend].scene} contentFit="fill" style={{
        position: 'absolute', width: frameWidth * 2, height: height * 2,
        left: (width - frameWidth) / 2 - column * frameWidth, top: -row * height,
      }} />}
    </View>
  );
}
