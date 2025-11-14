import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  // Build class names expected by tests
  const classes = [className].filter(Boolean);

  if (disabled) {
    classes.push('btn-disabled');
  } else {
    classes.push(`btn-${variant}`);
  }

  // size classes: btn-sm, btn-md, btn-lg
  if (size) classes.push(`btn-${size}`);

  const classAttr = classes.join(' ').trim();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classAttr}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;