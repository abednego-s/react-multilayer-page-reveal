import { keyframes } from 'goober';

export const animEffect32 = keyframes`
  0%,
  12.5% {
      transform: translate3d(0, 0, 0);
  }
  37.5%,
  62.5% {
      transform: translate3d(0, -100%, 0);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  87.5%,
  100% {
      transform: translate3d(0, -200%, 0);
  }
`;
