import { keyframes } from 'styled-components';

export const animEffect1 = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  35%,
  65% {
    transform: translate3d(0, -100%, 0);
  }
  100% {
    transform: translate3d(0, -200%, 0);
  }
`;
