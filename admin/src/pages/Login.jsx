import { useState } from 'react';
import { adminApi } from '../lib/api.js';
import { LOGO } from '../lib/format.js';

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Parolni kiriting');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { token } = await adminApi.login(password);
      onLogin(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit} noValidate>
        <img className="login-logo" src={LOGO} alt="" />
        <h1>XMR Pizza</h1>
        <p className="muted">Admin panelga kirish</p>

        <label className="field">
          <span>Parol</span>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Tekshirilmoqda...' : 'Kirish'}
        </button>
        <p className="hint">Parol loyiha papkasidagi .env faylida (ADMIN_PASSWORD).</p>
      </form>
    </div>
  );
}
