import React from 'react';

export const simpleUtility = (a, b) => a + b;

export const SimpleComponent = ({ text = 'Hello World', onClick }) => {
  return (
    <div data-testid="simple-component" onClick={onClick}>
      {text}
    </div>
  );
};

export default SimpleComponent;