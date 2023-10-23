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

### Basic Usage

Wrap your components inside `MultiLayerPageRevealProvider` component

```javascript
import React from 'react';
import { MultiLayerPageRevealProvider } from 'react-multilayer-page-reveal';
import { MyComponent } from './MyComponent';

function App() {
  return (
    <MultiLayerPageRevealProvider preset="duo-move" direction="left">
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

### Call a function when animation starts or ends

To call a function when animation starts, use `onStart` prop, or use `onEnd` to call a function when animation ends.

```javascript
function App() {
  function onStart() {
    console.log('animation starts');
  }

  function onEnd() {
    console.log('animation ends');
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

### Start the animation with a callback and delay

```javascript
function MyComponent() {
    ...
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

**preset** (`simple` | `duo-move` | `triple-woosh` |`content-move`)

Default: `simple`

Presets of the animation style

---

**direction** (`left` | `right` | `top` | `bottom` | `cornerTopLeft` | `cornerTopRight` | `cornerBottomLeft` | `cornerBottomRight`)

Default: `right`

Direction from which the animation moves

---

**onStart** (`Function`)

Callback function when animation starts

---

**onEnd** (`Function`)

Callback function when animation ends

---

**layerColors** (`string[]`)

Color(s) for the layers, e.g: `['#fff', '#ddd']`.

`simple` preset requires 1 color, `duo-move` requires 2 colors,
`tripe-woosh` and `content-move` require 3 colors.

If no layer colors provided, these default colors will be applied:

`simple`: <br> ['#202023']

`duo-move`: <br>['#202023', '#3d4a41']

`triple-woosh`: <br>['#0092dd', '#fff', '#3e3a35'],

`content-move`: <br>['#202023', '#555', '#d1d1d1']
