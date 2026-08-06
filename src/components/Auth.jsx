import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/data';

export default function Auth({ onAuthSuccess, showToast }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // 'member' or 'admin'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (!isSignIn && !name) {
      showToast('Please provide your name', 'error');
      return;
    }

    try {
      if (isSignIn) {
        const user = loginUser(email, password);
        showToast(`Welcome back, ${user.name}!`, 'success');
        onAuthSuccess(user);
      } else {
        const user = registerUser(name, email, password, role);
        showToast(`Account created. Welcome, ${user.name}!`, 'success');
        onAuthSuccess(user);
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title font-serif">
          {isSignIn ? 'Sign In' : 'Create Account'}
        </h1>
        
        {/* Toggle Sign In / Register Tabs */}
        <div className="auth-tabs">
          <button 
            type="button"
            className={`auth-tab ${isSignIn ? 'active' : ''}`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-tab ${!isSignIn ? 'active' : ''}`}
            onClick={() => setIsSignIn(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name field (Only for Register) */}
          {!isSignIn && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Account Role Selector (Only for Register) */}
          {!isSignIn && (
            <div className="form-group">
              <label className="form-label">Account Role</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${role === 'member' ? 'active' : ''}`}
                  onClick={() => setRole('member')}
                >
                  Member
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => setRole('admin')}
                >
                  Administrator
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary auth-submit-btn">
            {isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button 
          type="button" 
          className="auth-cancel-btn" 
          onClick={() => {
            setName('');
            setEmail('');
            setPassword('');
            setIsSignIn(true);
          }}
        >
          Cancel
        </button>
      </div>

      <style>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #09090E 0%, #12121C 100%);
          padding: 20px;
        }

        .auth-card {
          background-color: #12121C;
          border: 1px solid #232333;
          border-radius: 24px;
          padding: 56px 48px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          text-align: center;
        }

        .auth-title {
          font-size: 36px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 36px;
          letter-spacing: -0.5px;
        }

        .auth-tabs {
          display: flex;
          background-color: #1A1A28;
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 36px;
          border: 1px solid #232333;
        }

        .auth-tab {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: none;
          color: #8F8FAD;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-tab.active {
          background-color: #D29A2E;
          color: #12121C;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .role-selector {
          display: flex;
          background-color: #1A1A28;
          padding: 4px;
          border-radius: 12px;
          border: 1px solid #232333;
        }

        .role-btn {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: none;
          color: #8F8FAD;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-btn.active {
          background-color: #D29A2E;
          color: #12121C;
        }

        .auth-submit-btn {
          margin-top: 10px;
          padding: 18px;
          font-size: 18px;
          width: 100%;
        }

        .auth-cancel-btn {
          margin-top: 24px;
          background: none;
          border: none;
          color: #8F8FAD;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.2s ease;
        }

        .auth-cancel-btn:hover {
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}
