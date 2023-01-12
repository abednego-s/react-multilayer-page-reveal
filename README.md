# React Multi-Layer Page Reveal

A React component that adds multi-layer page transitions using CSS Animations. Inspired by Multi-Layer Page Reveal Effects by Codrops. Original repo: https://github.com/codrops/PageRevealEffects

<br />

[Demo](https://codesandbox.io/p/sandbox/react-multilayer-page-reveal-example-i3wfmc?file=%2Fsrc%2FApp.tsx)

<br />

## Installation

using npm

```bash
  npm install react-multilayer-page-reveal styled-components
```

using yarn

```bash
  yarn add react-multilayer-page-reveal styled-components
```

## Usage/Examples

Wrap your components inside `MultiLayerPageRevealProvider` component

```javascript
import React from 'react';
import { MultiLayerPageRevealProvider } from 'react-multilayer-page-reveal';
import { MyComponent } from './MyComponent';

function App() {
  function onStart() {
    console.log('animation start');
  }

  function onEnd() {
    console.log('animation end');
  }

  return (
    <MultiLayerPageRevealProvider
      preset="duo-move"
      direction="left"
      onStart={onStart}
      onEnd={onEnd}
    >
      <MyComponent />
    </MultiLayerPageRevealProvider>
  );
}
```

Start the animation by calling `reveal()` function from `useMultiLayerPageReveal` hook

```javascript
function MyComponent() {
  const { reveal } = useMultiLayerPageReveal();

  function handleReveal() {
    reveal();
  }

  return (
    <>
      <h1>Hello world</h1>
      <button onClick={handleReveal}>Go</button>
    </>
  );
}
```

Start the animation with a callback function

```javascript
function MyComponent() {
    ...
    // Do something after page transision effect ends.
    function handleReveal() {
        reveal(() => {
            console.log('hello')
        }, 750);
    }
    ...
    <button onClick={handleReveal}>Go</button>
}
```

## Props

| Prop          | Required | Type     | Description                                                                                                                                                                                                                                                                                                                   |
| :------------ | :------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preset`      | No       | String   | 'simple', 'duo-move', 'triple-woosh', 'content-move'. Default: 'simple'                                                                                                                                                                                                                                                       |
| `direction`   | No       | String   | 'left', 'right', 'top', 'bottom', 'cornerTopLeft', 'cornerTopRight', 'cornerBottomLeft', 'cornerBottomRight'. Default: "right"                                                                                                                                                                                                |
| `onEnd`       | No       | Function | Callback function when animation ends                                                                                                                                                                                                                                                                                         |
| `onStart`     | No       | Function | Callback function when animation starts                                                                                                                                                                                                                                                                                       |
| `layerColors` | No       | Array    | Array of colors, e.g: ['#fff', '#ddd']. "simple" preset requires 1 color, "duo-move" requires 2 colors, "tripe-woosh" and "content-move" require 3 colors. Default: "simple": ['#202023'], "duo-move": ['#202023', '#3d4a41'], "triple-woosh": ['#0092dd', '#fff', '#3e3a35'], "content-move": ['#202023', '#555', '#d1d1d1'] |
