import { useState } from 'react'
import './App.css'
import { useAuth } from './auth/AuthContext'

const greetings = {
  english: { name: 'English', text: 'Hello' },
  spanish: { name: 'Spanish', text: 'Hola' },
  french: { name: 'French', text: 'Bonjour' },
  german: { name: 'German', text: 'Guten Tag' },
  italian: { name: 'Italian', text: 'Ciao' },
  portuguese: { name: 'Portuguese', text: 'Olá' },
  japanese: { name: 'Japanese', text: 'こんにちは' },
  chinese: { name: 'Chinese', text: '你好' },
  korean: { name: 'Korean', text: '안녕하세요' },
  arabic: { name: 'Arabic', text: 'مرحبا' },
  russian: { name: 'Russian', text: 'Привет' },
  hindi: { name: 'Hindi', text: 'नमस्ते' }
}

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [userName, setUserName] = useState('')
  const { user, loading, error, isAuthenticated, login, logout } = useAuth()

  const currentGreeting = greetings[selectedLanguage]

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">Loading authentication...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="container">
          <h1 className="title">Multi-Language Greeting App</h1>
          <p className="subtitle">Secure authentication with EntraID</p>
          
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="auth-section">
            <p className="auth-description">
              Please sign in with your Microsoft account to use the greeting app.
            </p>
            <button onClick={login} className="login-button">
              Sign in with Microsoft
            </button>
          </div>
          
          <div className="info-section">
            <h3>About This App</h3>
            <p>
              This application uses <strong>PKCE (Proof Key for Code Exchange)</strong> authentication 
              flow with Microsoft EntraID (Azure Active Directory) to provide secure access.
            </p>
            <ul>
              <li>✓ Secure OAuth 2.0 authentication</li>
              <li>✓ PKCE for enhanced security</li>
              <li>✓ No client secrets exposed</li>
              <li>✓ 12 languages supported</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <div className="header-content">
            <h1 className="title">Multi-Language Greeting App</h1>
            <div className="user-info">
              <span className="user-name">{user?.name || user?.email}</span>
              <button onClick={logout} className="logout-button">
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        <p className="subtitle">Greet people in different languages!</p>

        <div className="input-section">
          <label htmlFor="name-input" className="label">
            Enter your name:
          </label>
          <input
            id="name-input"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
            className="input"
          />
        </div>

        <div className="language-section">
          <label className="label">Choose a language:</label>
          <div className="language-grid">
            {Object.entries(greetings).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => setSelectedLanguage(key)}
                className={`language-button ${selectedLanguage === key ? 'active' : ''}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div className="greeting-display">
          <div className="greeting-text">
            {currentGreeting.text}
            {userName && `, ${userName}`}!
          </div>
          <div className="language-name">
            in {currentGreeting.name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
