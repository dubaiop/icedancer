import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

const AuthContainer = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)

  const handleSwitchToSignup = () => {
    setIsLogin(false)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
  }

  const handleAuthSuccess = (authData) => {
    onLogin(authData)
  }

  return (
    <div>
      {isLogin ? (
        <LoginForm 
          onSwitchToSignup={handleSwitchToSignup}
          onLogin={handleAuthSuccess}
        />
      ) : (
        <SignupForm 
          onSwitchToLogin={handleSwitchToLogin}
          onSignup={handleAuthSuccess}
        />
      )}
    </div>
  )
}

export default AuthContainer 