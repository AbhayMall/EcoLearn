import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [showPasswordRules, setShowPasswordRules] = useState(false)
  const [googleRole, setGoogleRole] = useState('student')
  const [googleReady, setGoogleReady] = useState(false)
  const googleRoleRef = useRef('student')

  useEffect(() => {
    googleRoleRef.current = googleRole
  }, [googleRole])

  useEffect(() => {
    // load Google script dynamically
    const id = 'google-oauth-script'
    if (document.getElementById(id)) {
      setGoogleReady(true)
      return
    }
    const script = document.createElement('script')
    script.id = id
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => setGoogleReady(true)
    document.body.appendChild(script)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await axios.post('/api/auth/register', { name, email, password, role })
      navigate('/login')
    } catch (err) {
      setError('Registration failed')
    }
  }

  useEffect(() => {
    if (!googleReady) return
    if (!window.google || !window.google.accounts?.id) return
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (resp) => {
          try {
            const idToken = resp.credential
            const res = await axios.post('/api/auth/google', { idToken, role: googleRoleRef.current })
            const payload = res.data.data
            localStorage.setItem('ecolearn_user', JSON.stringify(payload))
            navigate('/app')
          } catch (e) {
            setError('Google registration failed')
          }
        },
      })
      const container = document.getElementById('google-register-btn')
      if (container) {
        container.innerHTML = ''
        window.google.accounts.id.renderButton(container, { theme: 'outline', size: 'large', width: 320 })
      }
    } catch (e) {
      setError('Google SDK init failed')
    }
  }, [googleReady])

  return (
    <div className="auth-container">
      <h2>Create your EcoLearn account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onMouseEnter={() => setShowPasswordRules(true)}
          onMouseLeave={() => setShowPasswordRules(false)}
          required
        />
        {showPasswordRules && (
          <div className="hint">
            Password must be at least 6 characters. Use upper, lower, number, symbol.
          </div>
        )}
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        {error && <div className="error">{error}</div>}
        <button type="submit">Register</button>
      </form>
      <div className="divider"><span>OR</span></div>
      <div className="google-section">
        <div className="google-role">
          <label>Register as</label>
          <select value={googleRole} onChange={(e) => setGoogleRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div id="google-register-btn" style={{ width: '100%' }} />
      </div>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}


