import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  MultiLayerPageRevealProvider,
  useMultiLayerPageReveal,
} from '../src/MultiLayerPageReveal';

const Demo = ({ revealCallback }: { revealCallback?: () => void }) => {
  const { reveal } = useMultiLayerPageReveal();

  function handleReveal() {
    if (revealCallback) {
      reveal(revealCallback, 750);
    } else {
      reveal();
    }
  }
  return (
    <button type="button" onClick={handleReveal}>
      Click
    </button>
  );
};
test('should render with "top" direction', () => {
  const container = render(
    <MultiLayerPageRevealProvider direction="top">
      <h1>Hello World</h1>
    </MultiLayerPageRevealProvider>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "bottom" direction', () => {
  const container = render(
    <MultiLayerPageRevealProvider direction="bottom">
      <h1>Hello World</h1>
    </MultiLayerPageRevealProvider>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "left" direction', () => {
  const container = render(
    <MultiLayerPageRevealProvider direction="left">
      <h1>Hello World</h1>
    </MultiLayerPageRevealProvider>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "cornerTopLeft" direction', () => {
  const container = render(
    <MultiLayerPageRevealProvider direction="cornerTopLeft">
      <h1>Hello World</h1>
    </MultiLayerPageRevealProvider>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "cornerTopRight" direction', () => {
  const container = render(
    <MultiLayerPageRevealProvider direction="cornerTopRight">
      <h1>Hello World</h1>
    </MultiLayerPageRevealProvider>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "cornerBottomLeft" direction', () => {
  const container = render(
    <MultiLayerPageRevealProvider direction="cornerBottomLeft">
      <h1>Hello World</h1>
    </MultiLayerPageRevealProvider>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "cornerBottomRight" direction', () => {
  const container = render(
    <MultiLayerPageRevealProvider direction="cornerBottomRight">
      <h1>Hello World</h1>
    </MultiLayerPageRevealProvider>
  );

  expect(container).toMatchSnapshot();
});

test('should render with custom layer colors', () => {
  const container = render(
    <MultiLayerPageRevealProvider
      preset="duo-move"
      layerColors={['#fff', '#ddd']}
    >
      <h1>Hello World</h1>
    </MultiLayerPageRevealProvider>
  );

  expect(container).toMatchSnapshot();
});

test('should throw an error if custom layer colors invalid', () => {
  expect(() => {
    render(
      <MultiLayerPageRevealProvider preset="duo-move" layerColors={['#fff']}>
        <h1>Hello World</h1>
      </MultiLayerPageRevealProvider>
    );
  }).toThrowError();
});

test('should throw an error if custom layer colors is not an array', () => {
  expect(() => {
    render(
      // @ts-expect-error
      <MultiLayerPageRevealProvider preset="duo-move" layerColors="oo">
        <h1>Hello World</h1>
      </MultiLayerPageRevealProvider>
    );
  }).toThrowError();
});

test('should render with "duo-move" preset', () => {
  const container = render(
    <MultiLayerPageRevealProvider preset="duo-move">
      <Demo />
    </MultiLayerPageRevealProvider>
  );

  fireEvent.click(container.getByRole('button'));
  expect(container).toMatchSnapshot();
});

test('should render with "triple-woosh" preset', () => {
  const container = render(
    <MultiLayerPageRevealProvider preset="triple-woosh">
      <Demo />
    </MultiLayerPageRevealProvider>
  );

  fireEvent.click(container.getByRole('button'));
  expect(container).toMatchSnapshot();
});

test('should render with "content-move" preset', () => {
  const container = render(
    <MultiLayerPageRevealProvider preset="content-move">
      <Demo />
    </MultiLayerPageRevealProvider>
  );

  fireEvent.click(container.getByRole('button'));
  expect(container).toMatchSnapshot();
});

test('should execute callbacks', async () => {
  const callbackFn = jest.fn();
  const onStartCallbackFn = jest.fn();
  const onEndCallbackFn = jest.fn();

  const { getByRole, getByTestId } = render(
    <MultiLayerPageRevealProvider
      onStart={onStartCallbackFn}
      onEnd={onEndCallbackFn}
    >
      <Demo revealCallback={callbackFn} />
    </MultiLayerPageRevealProvider>
  );

  fireEvent.click(getByRole('button'));
  fireEvent.animationEnd(
    getByTestId('react-multilayer-page-reveal').childNodes[0]
  );

  await waitFor(() => {
    expect(callbackFn).toBeCalledTimes(1);
    expect(onStartCallbackFn).toBeCalledTimes(1);
    expect(onEndCallbackFn).toBeCalledTimes(1);
  });
});
