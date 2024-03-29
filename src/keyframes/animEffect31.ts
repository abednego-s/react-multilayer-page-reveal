import { keyframes } from 'goober';

export const animEffect31 = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  25%,
  75% {
    transform: translate3d(0, -100%, 0);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: translate3d(0, -200%, 0);
  }
`;
