import Svg, { Path, Rect } from 'react-native-svg';

interface EmailMarkProps {
  size?: number;
}

export function EmailMark({ size = 20 }: EmailMarkProps) {
  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Rect
        fill="#F5EDE0"
        height="15"
        rx="3"
        stroke="#5C4A3A"
        strokeWidth="1.6"
        width="20"
        x="2"
        y="4.5"
      />
      <Path
        d="M3.8 7.2 12 13.4l8.2-6.2"
        fill="none"
        stroke="#C4573A"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Svg>
  );
}
