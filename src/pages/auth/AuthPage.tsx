import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signInWithGoogle } from '../../services/authService';
import '../../styles/Auth.css';

// Import icons (need to install)
// npm install react-icons
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, firstName, lastName);
      }
      
      navigate('/');
    } catch (error: any) {
      setError(
        error.message || 
        (isLogin ? 'Failed to sign in' : 'Failed to create account')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      
      await signInWithGoogle();
      navigate('/');
    } catch (error: any) {
      setError(error.message || `Failed to ${isLogin ? 'sign in' : 'sign up'} with Google`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container compact">
        <div className="auth-card compact">
          <div className="auth-header compact">
            <h1>HustleChha<span className="accent">.</span></h1>
            <p>{isLogin ? 'Sign in to your account' : 'Create your account'}</p>
          </div>
          
          <div className="auth-tabs">
            <div 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </div>
            <div 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </div>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form compact">
            {!isLogin && (
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-wrapper with-icon">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      id="firstName"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group half">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-wrapper with-icon">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper with-icon">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper with-icon">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper with-icon">
                  <FiLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            )}
            
            {isLogin && (
              <div className="auth-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
            )}
            
            <div className="auth-actions">
              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading
                  ? (isLogin ? 'Signing in...' : 'Creating account...')
                  : (isLogin ? 'Sign In' : 'Create Account')
                }
              </button>
              
              <div className="auth-divider compact">or</div>
              
              <button
                onClick={handleGoogleSignIn}
                className="google-auth-button"
                disabled={loading}
                type="button"
              >
                <img src="/google-icon.svg" alt="Google" />
                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
              </button>
            </div>
            
            <div className="auth-footer compact">
              {isLogin 
                ? "Don't have an account?" 
                : "Already have an account?"
              }
              <a href="#" onClick={(e) => {
                e.preventDefault();
                toggleAuthMode();
              }}>
                {isLogin ? ' Sign Up' : ' Sign In'}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 