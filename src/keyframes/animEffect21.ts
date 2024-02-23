import { keyframes } from 'goober';

export const animEffect21 = keyframes`
  0% {
      transform: translate3d(0, 0, 0);
  }
  30%,
  70% {
      transform: translate3d(0, -100%, 0);
      animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  }
  100% {
      transform: translate3d(0, -200%, 0);
  }
`;
