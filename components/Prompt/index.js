import React from 'react';
import './index.css';

const Prompt = ({ 
  prompts = [], 
  theme = 'light',
  onSelect,
}) => {
  return (
    <div className={`prompt-list ${theme}`}>
      {prompts.map((item, index) => (
        <button
          type='button'
          key={index}
          className="prompt-item"
          onClick={() => onSelect?.(item.value)}
          title={item.title}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
};

export default Prompt;
