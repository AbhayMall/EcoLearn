import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [role, setRole] = useState('student')
  const [googleReady, setGoogleReady] = useState(false)
  const roleRef = useRef('student')

  useEffect(() => {
    roleRef.current = role
  }, [role])

  useEffect(() => {
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
      if (role === 'admin') {
        if (email !== 'abhaymall9305@gmail.com' || password !== 'Abhay@9305') {
          setError('Only the configured admin can login as admin')
          return
        }
        const payload = { id: 'admin', name: 'Admin', role: 'admin', token: 'admin-local' }
        localStorage.setItem('ecolearn_user', JSON.stringify(payload))
        navigate('/app/admin')
        return
      }
      const res = await axios.post('/api/auth/login', { email, password })
      let payload = res.data.data
      localStorage.setItem('ecolearn_user', JSON.stringify(payload))
      navigate('/app')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  useEffect(() => {
    if (!googleReady) return
    if (!window.google || !window.google.accounts?.id) return
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (resp) => {
          if (roleRef.current === 'admin') {
            setError('Admin login via Google is not allowed')
            return
          }
          try {
            const idToken = resp.credential
            const res = await axios.post('/api/auth/google', { idToken, role: roleRef.current })
            const payload = res.data.data
            localStorage.setItem('ecolearn_user', JSON.stringify(payload))
            navigate('/app')
          } catch (e) {
            setError('Google login failed')
          }
        },
      })
      const container = document.getElementById('google-login-btn')
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
      <h2>EcoLearn Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
      <div className="divider"><span>OR</span></div>
      <div id="google-login-btn" style={{ width: '100%' }} />
      <p>New here? <Link to="/register">Register</Link></p>
    </div>
  )
}


