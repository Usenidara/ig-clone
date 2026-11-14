import { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function Login() {
  const { loginWithUsername } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await loginWithUsername(username.trim(), password);
    setSubmitting(false);
    if (error) setError(error.message);
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1 className="login-logo">Instaclone</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Phone number, username, or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoCapitalize="none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>

          <p className="login-forgot">Forgot password?</p>

          <div className="login-divider">
            <span /> <p>OR</p> <span />
          </div>

          <p className="login-fb">
            <span className="login-fb-icon">f</span> Log in with Facebook
          </p>
        </form>
      </div>

      <div className="login-signup-box">
        <p>
          Don't have an account? <span className="signup-link">Sign up</span>
        </p>
      </div>
    </div>
  );
}
