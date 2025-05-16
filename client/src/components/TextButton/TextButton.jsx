import React from 'react';
import PropTypes from 'prop-types';

function TextButton({ text = "Click Me", onClick, icon = null, className = "", textClassName="", iconEnd=true, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-blue-500 rounded-4xl px-3 py-1 
                  hover:bg-gray-100 hover:text-blue-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-300 
                  transition-colors duration-200 cursor-pointer ${className}`}
      {...props}
    >
   {icon && !iconEnd && <span className="flex-shrink-0">{icon}</span>}
   <span className={`text-sm font-medium tracking-wide ${textClassName}`}>{text}</span>
   {icon && iconEnd && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}

TextButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.node,
};

export default TextButton;
