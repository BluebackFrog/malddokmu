import Svg, { Path, Rect } from 'react-native-svg';

type IconName = 'mic' | 'speaker' | 'stop' | 'keyboard' | 'down' | 'check' | 'close';
const paths = {
  speaker: 'M3 9h4l5-4v14l-5-4H3z M16 8a6 6 0 0 1 0 8 M19 5a10 10 0 0 1 0 14',
  keyboard: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M6 10h.1 M10 10h.1 M14 10h.1 M18 10h.1 M8 15h8',
  down: 'm6 9 6 6 6-6', check: 'm4 12 5 5L20 6', close: 'm6 6 12 12 M18 6 6 18',
};

export function Icon({ name, color, size = 24 }: { name: IconName; color: string; size?: number }) {
  if (name === 'mic') return (
    <Svg width={size} height={size} viewBox="0 0 32 40" accessible={false}>
      <Rect x="10" y="2" width="12" height="22" rx="6" fill={color} />
      <Path d="M4 18v3a12 12 0 0 0 24 0v-3M16 33v5M10 38h12" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      {name === 'stop' ? <Rect x="5" y="5" width="14" height="14" rx="3" fill={color} />
        : <Path d={paths[name]} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
    </Svg>
  );
}
