import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { styled, setup, css } from 'goober';
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

setup(React.createElement);

export type Direction =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'cornerTopLeft'
  | 'cornerTopRight'
  | 'cornerBottomLeft'
  | 'cornerBottomRight';

export type Preset = 'simple' | 'duo-move' | 'triple-woosh' | 'content-move';

export type MultiLayerPageRevealProps = {
  children?: React.ReactNode;
  direction?: Direction;
  layerColors?: string[];
  onEnd?: (direction: Direction) => void;
  onStart?: (direction: Direction) => void;
  preset?: Preset;
};

type ContextValues = {
  reveal: (callback?: () => void, callbackTime?: number) => void;
};

export type PresetConfig = {
  [P in Preset]: {
    layerColors: string[];
    numOfLayers: number;
  };
};

const MultiLayerPageRevealContext = createContext({} as ContextValues);

const RevealerClassName = ({
  direction,
  isAnimating,
  preset,
}: {
  direction?: Direction;
  isAnimating?: boolean;
  preset?: Preset;
}) => {
  const opacity = isAnimating ? '1' : '0';
  let allStyles = {};

  if (
    direction === 'cornerTopLeft' ||
    direction === 'cornerTopRight' ||
    direction === 'cornerBottomLeft' ||
    direction === 'cornerBottomRight'
  ) {
    let style: Partial<CSSStyleDeclaration> = {
      opacity,
    };

    if (isAnimating) {
      style = {
        ...style,
        top: '50%',
        left: '50%',
      };
    }

    allStyles = {
      ...allStyles,
      ...style,
    };
  }

  if (direction === 'top' || direction === 'bottom') {
    const transform =
      direction === 'top' ? 'rotate3d(0, 0, 1, 180deg)' : 'none';

    let style: Partial<CSSStyleDeclaration> = {
      width: '100vw',
      height: '100vh',
      transform,
      opacity,
    };

    if (isAnimating) {
      if (direction === 'top') {
        style = {
          ...style,
          left: '0',
          bottom: '100%',
        };
      } else {
        style = {
          ...style,
          left: '0',
          top: '100%',
        };
      }
    }

    allStyles = {
      ...allStyles,
      ...style,
    };
  }

  if (direction === 'right' || direction === 'left') {
    const transform = `translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, ${
      direction === 'left' ? 90 : -90
    }deg) translate3d(0,100%,0)`;

    let style: Partial<CSSStyleDeclaration> = {
      width: '100vh',
      height: '100vw',
      transform,
      opacity,
    };

    if (isAnimating) {
      style = {
        ...style,
        top: '50%',
        left: '50%',
      };
    }

    allStyles = {
      ...allStyles,
      ...style,
    };
  }

  if (isAnimating) {
    if (preset === 'simple') {
      allStyles = {
        ...allStyles,
        [`& > div`]: {
          animation: `${animEffect1} 1.5s cubic-bezier(0.2, 1, 0.3, 1) forwards`,
        },
      };
    }
    if (preset === 'duo-move') {
      allStyles = {
        ...allStyles,
        [`& > div`]: {
          animation: `${animEffect21} 1.5s cubic-bezier(0.7, 0, 0.3, 1) forwards`,
          [`&:nth-child(2)`]: {
            'animation-name': animEffect22,
          },
        },
      };
    }
    if (preset === 'triple-woosh') {
      allStyles = {
        ...allStyles,
        [`& > div`]: {
          animation: `${animEffect31} 1.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards`,
          [`&:nth-child(2)`]: {
            'animation-name': animEffect32,
          },
          [`&:nth-child(3)`]: {
            'animation-name': animEffect33,
          },
        },
      };
    }
    if (preset === 'content-move') {
      allStyles = {
        ...allStyles,
        [`& > div`]: {
          animation: `${animEffect41} 1.5s cubic-bezier(0.55, 0.055, 0.675, 0.19)forwards`,
          [`&:nth-child(2)`]: {
            'animation-name': animEffect42,
            'animation-timing-function':
              'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
          },
          [`&:nth-child(3)`]: {
            'animation-name': animEffect43,
            'animation-timing-function':
              'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
          },
        },
      };
    }
  }

  return css(allStyles);
};

const presetConfig: PresetConfig = {
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

const Revealer = styled('div', React.forwardRef)`
  position: fixed;
  z-index: 1000;
  pointer-events: none;
`;

const RevealerLayer = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #ddd;
`;

const PageLayers = ({
  numOfLayers,
  layerColors,
  onAnimationEnd,
}: {
  layerColors: string[];
  numOfLayers: number;
  onAnimationEnd: () => void;
}) => (
  <>
    {Array.from(Array(numOfLayers), (_, index) => (
      <RevealerLayer
        key={index}
        style={{ background: layerColors[index] }}
        onAnimationEnd={onAnimationEnd}
      />
    ))}
  </>
);

export const MultiLayerPageRevealProvider = ({
  preset = 'simple',
  direction = 'right',
  onStart,
  onEnd,
  layerColors,
  children,
}: MultiLayerPageRevealProps) => {
  const [windowSize, setWindowSize] = useState({
    windowWidth: 0,
    windowHeight: 0,
  });
  const [isAnimating, setAnimating] = useState(false);
  const refRevealer = useRef<HTMLDivElement>(null);
  const refTimer = useRef<ReturnType<typeof setTimeout>>();
  const refLayersCounter = useRef(0);

  const config = useMemo(() => {
    let currentConfig = presetConfig[preset];
    if (layerColors) {
      if (!Array.isArray(layerColors)) {
        throw new Error('"layerColors" expects an array.');
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
  }, [layerColors, preset]);

  const { windowWidth, windowHeight } = windowSize;

  const handleAnimationEnd = () => {
    ++refLayersCounter.current;

    if (refLayersCounter.current === config.numOfLayers) {
      setAnimating(false);
      refLayersCounter.current = 0;
      if (onEnd && typeof onEnd === 'function') {
        onEnd(direction);
      }
    }
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
    const pageDiagonal = Math.sqrt(windowWidth ** 2 + windowHeight ** 2);
    const width = `${pageDiagonal}px`;
    const height = `${pageDiagonal}px`;
    let transform = '';

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
      <Revealer
        ref={refRevealer}
        data-testid="react-multilayer-page-reveal"
        className={RevealerClassName({ direction, isAnimating, preset })}
        style={{ ...getRevealerStyle() }}
      >
        <PageLayers
          numOfLayers={config.numOfLayers}
          layerColors={config.layerColors}
          onAnimationEnd={handleAnimationEnd}
        />
      </Revealer>
    </MultiLayerPageRevealContext.Provider>
  );
};

export const useMultiLayerPageReveal = () =>
  useContext(MultiLayerPageRevealContext);
