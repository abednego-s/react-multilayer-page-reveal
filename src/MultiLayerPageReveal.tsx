import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import {
  animEffect1,
  animEffect21,
  animEffect22,
  animEffect31,
  animEffect32,
  animEffect33,
  animEffect41,
  animEffect42,
  animEffect43,
} from './keyframes';
import { debounce } from './utils';

type Direction =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'cornerTopLeft'
  | 'cornerTopRight'
  | 'cornerBottomLeft'
  | 'cornerBottomRight';

type Preset = 'simple' | 'duo-move' | 'triple-woosh' | 'content-move';

interface Props {
  children?: JSX.Element | JSX.Element[];
  direction?: Direction;
  layerColors?: string[];
  onEnd?: (direction: Direction) => void;
  onStart?: (direction: Direction) => void;
  preset?: Preset;
}

interface RevealerDivProps {
  direction?: Direction;
  isAnimating?: boolean;
  preset?: Preset;
  windowHeight: number;
  windowWidth: number;
}

interface ContextValues {
  reveal: (callback?: () => void, callbackTime?: number) => void;
}

const MultiLayerPageRevealContext = createContext({} as ContextValues);

const getStyles = ({ direction, isAnimating }: RevealerDivProps) => {
  const opacity = isAnimating ? '1' : '0';
  let transform = '';

  if (
    direction === 'cornerTopLeft' ||
    direction === 'cornerTopRight' ||
    direction === 'cornerBottomLeft' ||
    direction === 'cornerBottomRight'
  ) {
    return css`
      ${isAnimating ? 'top: 50%; left: 50%;' : null}
      opacity: ${opacity};
    `;
  }

  if (direction === 'top' || direction === 'bottom') {
    transform = direction === 'top' ? 'rotate3d(0, 0, 1, 180deg)' : 'none';

    return css`
      left: 0;
      width: 100vh;
      height: 100vw;
      ${direction === 'top' ? 'bottom: 100%;' : 'top: 100%;'}
      transform: ${transform};
      opacity: ${opacity};
    `;
  }

  if (direction === 'right' || direction === 'left') {
    transform = `translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, ${
      direction === 'left' ? 90 : -90
    }deg) translate3d(0,100%,0)`;

    return css`
      width: 100vh;
      height: 100vw;
      ${isAnimating ? 'top: 50%; left: 50%;' : null}
      transform: ${transform};
      opacity: ${opacity};
    `;
  }

  return null;
};

const getAnimationStyle = ({ preset, isAnimating }: RevealerDivProps) => {
  if (isAnimating) {
    if (preset === 'simple') {
      return css`
        & > ${RevealerLayerDiv} {
          animation: ${animEffect1} 1.5s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }
      `;
    }
    if (preset === 'duo-move') {
      return css`
        & > ${RevealerLayerDiv} {
          animation: ${animEffect21} 1.5s cubic-bezier(0.7, 0, 0.3, 1) forwards;
          &:nth-child(2) {
            animation-name: ${animEffect22};
          }
        }
      `;
    }
    if (preset === 'triple-woosh') {
      return css`
        & > ${RevealerLayerDiv} {
          animation: ${animEffect31} 1.5s cubic-bezier(0.55, 0.055, 0.675, 0.19)
            forwards;
          &:nth-child(2) {
            animation-name: ${animEffect32};
          }
          &:nth-child(3) {
            animation-name: ${animEffect33};
          }
        }
      `;
    }
    if (preset === 'content-move') {
      return css`
        & > div {
          animation: ${animEffect41} 1.5s cubic-bezier(0.55, 0.055, 0.675, 0.19)
            forwards;

          &:nth-child(2) {
            animation-name: ${animEffect42};
            animation-timing-function: cubic-bezier(0.895, 0.03, 0.685, 0.22);
          }

          &:nth-child(3) {
            animation-name: ${animEffect43};
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          }
        }
      `;
    }
  }
  return null;
};

const presetConfig = {
  simple: {
    numOfLayers: 1,
    layerColors: ['#202023'],
  },
  'duo-move': {
    numOfLayers: 2,
    layerColors: ['#202023', '#3d4a41'],
  },
  'triple-woosh': {
    numOfLayers: 3,
    layerColors: ['#0092dd', '#fff', '#3e3a35'],
  },
  'content-move': {
    numOfLayers: 3,
    layerColors: ['#202023', '#555', '#d1d1d1'],
  },
};

const RevealerDiv = styled.div`
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  ${getStyles}
  ${getAnimationStyle}
`;

const RevealerLayerDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #ddd;
`;

export const MultiLayerPageRevealProvider = ({
  preset = 'simple',
  direction = 'right',
  onStart,
  onEnd,
  layerColors,
  children,
}: Props) => {
  const [windowSize, setWindowSize] = useState({
    windowWidth: 0,
    windowHeight: 0,
  });
  const [isAnimating, setAnimating] = useState(false);
  const refRevealer = useRef<HTMLDivElement>(null);
  const refTimer = useRef<ReturnType<typeof setTimeout>>();
  const refLayersCounter = useRef(0);

  const config = useMemo(() => {
    let currentConfig = presetConfig[preset as keyof typeof presetConfig];
    if (layerColors) {
      if (!Array.isArray(layerColors)) {
        throw new Error('layerColors is not an array.');
      }
      if (layerColors.length !== currentConfig.layerColors.length) {
        throw new Error(
          `"${preset}" effect takes ${currentConfig.layerColors.length} layer colors. ${layerColors.length} is given.`
        );
      }
      currentConfig = {
        ...currentConfig,
        layerColors,
      };
    }
    return currentConfig;
  }, [layerColors]);

  const { windowWidth, windowHeight } = windowSize;

  const onEndAnimation = () => {
    ++refLayersCounter.current;

    if (refLayersCounter.current === config.numOfLayers) {
      setAnimating(false);
      refLayersCounter.current = 0;
      if (onEnd && typeof onEnd === 'function') {
        onEnd(direction);
      }
    }
  };

  const addLayers = () => {
    const layers = [];
    for (let i = 0; i < config.numOfLayers; i++) {
      layers.push(
        <RevealerLayerDiv
          key={i}
          style={{ background: config.layerColors[i] }}
          onAnimationEnd={onEndAnimation}
        />
      );
    }
    return layers;
  };

  const reveal = (callback?: () => void, callbackTime?: number) => {
    setAnimating(true);
    if (onStart && typeof onStart === 'function') {
      onStart(direction);
    }

    if (refTimer.current) {
      clearTimeout(refTimer.current);
    }

    refTimer.current = setTimeout(() => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    }, callbackTime);
  };

  const getRevealerStyle = () => {
    let width = '';
    let height = '';
    let transform = '';

    const pageDiagonal = Math.sqrt(windowWidth ** 2 + windowHeight ** 2);

    width = `${pageDiagonal}px`;
    height = `${pageDiagonal}px`;

    if (direction === 'cornerTopLeft') {
      transform = `translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, 135deg) translate3d(0, ${pageDiagonal}px, 0)`;
    } else if (direction === 'cornerTopRight') {
      transform = `translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, -135deg) translate3d(0, ${pageDiagonal}px, 0)`;
    } else if (direction === 'cornerBottomLeft') {
      transform = `translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, 45deg) translate3d(0, ${pageDiagonal}px, 0)`;
    } else if (direction === 'cornerBottomRight') {
      transform = `translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, -45deg) translate3d(0, ${pageDiagonal}px, 0)`;
    }

    if (isAnimating) {
      if (
        direction === 'cornerTopLeft' ||
        direction === 'cornerTopRight' ||
        direction === 'cornerBottomLeft' ||
        direction === 'cornerBottomRight'
      ) {
        return {
          width,
          height,
          transform,
        };
      }
    }

    return null;
  };

  const contextValue = useMemo(
    () => ({
      reveal,
    }),
    []
  );

  useLayoutEffect(() => {
    const updateSize = debounce(() => {
      setWindowSize({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    }, 100);
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <MultiLayerPageRevealContext.Provider value={contextValue}>
      {children}
      <RevealerDiv
        ref={refRevealer}
        preset={preset}
        isAnimating={isAnimating}
        direction={direction}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        data-testid="react-multilayer-page-reveal"
        style={{ ...getRevealerStyle() }}
      >
        {addLayers()}
      </RevealerDiv>
    </MultiLayerPageRevealContext.Provider>
  );
};

export const useMultiLayerPageReveal = () =>
  useContext(MultiLayerPageRevealContext);
