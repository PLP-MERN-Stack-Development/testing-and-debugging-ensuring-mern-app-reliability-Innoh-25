import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { SimpleComponent, simpleUtility } from './SimpleComponent';

describe('SimpleComponent', () => {
  it('renders with default text', () => {
    render(<SimpleComponent />);
    expect(screen.getByTestId('simple-component')).toHaveTextContent('Hello World');
  });

  it('renders with custom text', () => {
    render(<SimpleComponent text="Custom Text" />);
    expect(screen.getByTestId('simple-component')).toHaveTextContent('Custom Text');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<SimpleComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByTestId('simple-component'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('simpleUtility', () => {
  it('adds two numbers correctly', () => {
    expect(simpleUtility(2, 3)).toBe(5);
    expect(simpleUtility(-1, 1)).toBe(0);
    expect(simpleUtility(0, 0)).toBe(0);
  });
});