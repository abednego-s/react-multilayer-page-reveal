import { keyframes } from 'goober';

export const animEffect22 = keyframes`
  0%,
  14.5% {
    transform: translate3d(0, 0, 0);
  }
  37.5%,
  62.5% {
    transform: translate3d(0, -100%, 0);
    animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
 }
  85.5%,
  100% {
    transform: translate3d(0, -200%, 0);
  }
`;
