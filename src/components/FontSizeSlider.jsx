import { useState, useEffect } from 'react';
import './FontSizeSlider.css';

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 24;
const FONT_SIZE_DEFAULT = 16;
const STORAGE_KEY = 'user-font-size-preference';

function FontSizeSlider() {
  const [fontSize, setFontSize] = useState(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : FONT_SIZE_DEFAULT;
  });

  useEffect(() => {
    // Apply font size to the document root
    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, fontSize.toString());
  }, [fontSize]);

  const handleSliderChange = (e) => {
    setFontSize(parseInt(e.target.value, 10));
  };

  const handleReset = () => {
    setFontSize(FONT_SIZE_DEFAULT);
  };

  return (
    <div className="font-size-slider-container">
      <label htmlFor="font-size-slider" className="font-size-label">
        <span className="label-icon" aria-hidden="true">Aa</span>
        <span className="label-text">Font Size</span>
      </label>
      <div className="slider-controls">
        <span className="size-indicator small" aria-hidden="true">A</span>
        <input
          id="font-size-slider"
          type="range"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          value={fontSize}
          onChange={handleSliderChange}
          className="font-size-slider"
          aria-label="Adjust font size"
          aria-valuemin={FONT_SIZE_MIN}
          aria-valuemax={FONT_SIZE_MAX}
          aria-valuenow={fontSize}
          aria-valuetext={`${fontSize} pixels`}
        />
        <span className="size-indicator large" aria-hidden="true">A</span>
        <span className="font-size-value" aria-live="polite">
          {fontSize}px
        </span>
        {fontSize !== FONT_SIZE_DEFAULT && (
          <button
            onClick={handleReset}
            className="reset-button"
            aria-label="Reset font size to default"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default FontSizeSlider;
