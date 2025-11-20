import { useState } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import SignInButton from './components/SignInButton'
import SignOutButton from './components/SignOutButton'
import UserProfile from './components/UserProfile'
import './App.css'

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
  const isAuthenticated = useIsAuthenticated()
  const { accounts } = useMsal()

  const currentGreeting = greetings[selectedLanguage]
  const authenticatedUserName = isAuthenticated && accounts[0] ? accounts[0].name : ''

  return (
    <div className="app">
      <div className="container">
        <div className="auth-section">
          {isAuthenticated ? (
            <div className="auth-info">
              <span className="user-name">Welcome, {authenticatedUserName}!</span>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>

        <h1 className="title">Multi-Language Greeting App</h1>
        <p className="subtitle">Greet people in different languages!</p>

        {isAuthenticated && <UserProfile />}

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
            {(userName || authenticatedUserName) && `, ${userName || authenticatedUserName}`}!
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
