import { useState, useEffect } from 'react'
import './HighContrastToggle.css'

function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    // Load preference from localStorage on initial render with error handling
    try {
      const saved = localStorage.getItem('highContrastMode')
      return saved === 'true'
    } catch (error) {
      // localStorage might not be available (e.g., in SSR or private browsing)
      console.warn('localStorage not available:', error)
      return false
    }
  })

  useEffect(() => {
    // Apply or remove high contrast class to body
    if (isHighContrast) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }
    
    // Save preference to localStorage with error handling
    try {
      localStorage.setItem('highContrastMode', isHighContrast.toString())
    } catch (error) {
      // localStorage might not be available (e.g., in SSR or private browsing)
      console.warn('Could not save to localStorage:', error)
    }
  }, [isHighContrast])

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast)
  }

  const handleKeyDown = (event) => {
    // Handle Space and Enter keys for accessibility
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault() // Prevent page scroll on Space
      toggleHighContrast()
    }
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
        onKeyDown={handleKeyDown}
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
