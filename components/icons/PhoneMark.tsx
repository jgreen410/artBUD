import Svg, { Path } from 'react-native-svg';

interface PhoneMarkProps {
  size?: number;
}

export function PhoneMark({ size = 20 }: PhoneMarkProps) {
  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M7.5 2.75h9a1.75 1.75 0 0 1 1.75 1.75v15a1.75 1.75 0 0 1-1.75 1.75h-9a1.75 1.75 0 0 1-1.75-1.75v-15A1.75 1.75 0 0 1 7.5 2.75Z"
        fill="#F5EDE0"
        stroke="#5C4A3A"
        strokeWidth="1.6"
      />
      <Path
        d="M10 6.25h4M10.9 17.5h2.2"
        fill="none"
        stroke="#C8852A"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </Svg>
  );
}
