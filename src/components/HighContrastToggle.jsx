import { useState, useEffect } from 'react'
import './HighContrastToggle.css'

function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    // Load preference from localStorage on initial render
    const saved = localStorage.getItem('highContrastMode')
    return saved === 'true'
  })

  useEffect(() => {
    // Apply or remove high contrast class to body
    if (isHighContrast) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }
    
    // Save preference to localStorage
    localStorage.setItem('highContrastMode', isHighContrast.toString())
  }, [isHighContrast])

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast)
  }

  return (
    <div className="high-contrast-toggle">
      <label htmlFor="high-contrast-switch" className="toggle-label">
        High Contrast
      </label>
      <button
        id="high-contrast-switch"
        className={`toggle-switch ${isHighContrast ? 'active' : ''}`}
        onClick={toggleHighContrast}
        aria-label="Toggle high contrast mode"
        aria-pressed={isHighContrast}
        role="switch"
      >
        <span className="toggle-slider"></span>
      </button>
    </div>
  )
}

export default HighContrastToggle
