import { keyframes } from 'goober';

export const animEffect42 = keyframes`
 0% {
    transform: translate3d(0, 0, 0);
  }
  45%,
  55% {
    transform: translate3d(0, -100%, 0);
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  100% {
    transform: translate3d(0, -200%, 0);
  }
`;
