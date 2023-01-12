import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  MultiLayerPageReveal,
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
    <MultiLayerPageReveal direction="top">
      <h1>Hello World</h1>
    </MultiLayerPageReveal>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "bottom" direction', () => {
  const container = render(
    <MultiLayerPageReveal direction="bottom">
      <h1>Hello World</h1>
    </MultiLayerPageReveal>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "left" direction', () => {
  const container = render(
    <MultiLayerPageReveal direction="left">
      <h1>Hello World</h1>
    </MultiLayerPageReveal>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "cornerTopLeft" direction', () => {
  const container = render(
    <MultiLayerPageReveal direction="cornerTopLeft">
      <h1>Hello World</h1>
    </MultiLayerPageReveal>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "cornerTopRight" direction', () => {
  const container = render(
    <MultiLayerPageReveal direction="cornerTopRight">
      <h1>Hello World</h1>
    </MultiLayerPageReveal>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "cornerBottomLeft" direction', () => {
  const container = render(
    <MultiLayerPageReveal direction="cornerBottomLeft">
      <h1>Hello World</h1>
    </MultiLayerPageReveal>
  );

  expect(container).toMatchSnapshot();
});

test('should render with "cornerBottomRight" direction', () => {
  const container = render(
    <MultiLayerPageReveal direction="cornerBottomRight">
      <h1>Hello World</h1>
    </MultiLayerPageReveal>
  );

  expect(container).toMatchSnapshot();
});

test('should render with custom layer colors', () => {
  const container = render(
    <MultiLayerPageReveal preset="duo-move" layerColors={['#fff', '#ddd']}>
      <h1>Hello World</h1>
    </MultiLayerPageReveal>
  );

  expect(container).toMatchSnapshot();
});

test('should throw an error if custom layer colors invalid', () => {
  jest.spyOn(console, 'error');

  expect(() => {
    render(
      <MultiLayerPageReveal preset="duo-move" layerColors={['#fff']}>
        <h1>Hello World</h1>
      </MultiLayerPageReveal>
    );
  }).toThrowError();
});

test('should throw an error if custom layer colors is not an array', () => {
  expect(() => {
    render(
      // @ts-expect-error
      <MultiLayerPageReveal preset="duo-move" layerColors="oo">
        <h1>Hello World</h1>
      </MultiLayerPageReveal>
    );
  }).toThrowError();
});

test('should render with "duo-move" preset', () => {
  const container = render(
    <MultiLayerPageReveal preset="duo-move">
      <Demo />
    </MultiLayerPageReveal>
  );

  fireEvent.click(container.getByRole('button'));
  expect(container).toMatchSnapshot();
});

test('should render with "triple-woosh" preset', () => {
  const container = render(
    <MultiLayerPageReveal preset="triple-woosh">
      <Demo />
    </MultiLayerPageReveal>
  );

  fireEvent.click(container.getByRole('button'));
  expect(container).toMatchSnapshot();
});

test('should render with "content-move" preset', () => {
  const container = render(
    <MultiLayerPageReveal preset="content-move">
      <Demo />
    </MultiLayerPageReveal>
  );

  fireEvent.click(container.getByRole('button'));
  expect(container).toMatchSnapshot();
});

test('should execute callbacks', async () => {
  const callbackFn = jest.fn();
  const onStartCallbackFn = jest.fn();
  const onEndCallbackFn = jest.fn();

  const { getByRole, getByTestId } = render(
    <MultiLayerPageReveal onStart={onStartCallbackFn} onEnd={onEndCallbackFn}>
      <Demo revealCallback={callbackFn} />
    </MultiLayerPageReveal>
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
