import Svg, { Path } from 'react-native-svg';

interface GoogleMarkProps {
  size?: number;
}

export function GoogleMark({ size = 20 }: GoogleMarkProps) {
  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.05 5.05 0 0 1-2.22 3.31v2.75h3.6c2.11-1.94 3.26-4.8 3.26-8.07Z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.3-2.68l-3.6-2.75c-1 .67-2.27 1.06-3.7 1.06-2.85 0-5.26-1.92-6.12-4.5H2.18v2.84A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <Path
        d="M5.88 14.13A6.64 6.64 0 0 1 5.55 12c0-.74.13-1.45.34-2.13V7.03H2.18A11 11 0 0 0 1 12c0 1.77.42 3.43 1.18 4.97l3.7-2.84Z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.08.56 4.23 1.66l3.17-3.17C17.44 2.08 14.96 1 12 1A11 11 0 0 0 2.18 7.03l3.71 2.84C6.74 7.3 9.15 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </Svg>
  );
}
