import { useEffect, useState } from 'react'
import api from '../../api'

export default function AdminDashboard() {
  const [showList, setShowList] = useState(false)
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [broadcast, setBroadcast] = useState({ audience: 'teachers', title: '', body: '' })
  const [sentInfo, setSentInfo] = useState('')
  const [approvedTeachers, setApprovedTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [content, setContent] = useState([])
  const [view, setView] = useState('home')
  const [activeCard, setActiveCard] = useState(null)

  async function openList() {
    setShowList(true)
    setLoading(true)
    try {
      const r = await api.get('/admin/teachers/detailed')
      setTeachers(r.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  async function setApproval(teacherId, isApproved) {
    await api.post('/admin/approve-teacher', { teacherId, isApproved })
    await openList()
  }

  async function viewResume(teacherId) {
    try {
      const res = await api.get(`/teachers/resume/${teacherId}`, { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      alert('Failed to load resume')
    }
  }

  async function loadApprovedTeachers() {
    const r = await api.get('/admin/teachers/approved')
    setApprovedTeachers(r.data.data || [])
  }

  async function loadStudents() {
    const r = await api.get('/admin/students/detailed')
    setStudents(r.data.data || [])
  }

  async function loadContent() {
    const r = await api.get('/admin/content')
    setContent(r.data.data || [])
  }

  return (
    <div>
      <h3>Admin</h3>
      <div className="card" style={{margin:'12px 0', padding:16, border:'1px solid #e5e7eb', borderRadius:12}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h4 style={{margin:0}}>Broadcast Notification</h4>
        </div>
        <div className="auth-form" style={{display:'grid', gridTemplateColumns:'1fr 1fr 2fr auto', gap:8}}>
          <select value={broadcast.audience} onChange={(e)=>setBroadcast({...broadcast, audience:e.target.value})}>
            <option value="teachers">Teachers</option>
            <option value="students">Students</option>
            <option value="all">All</option>
          </select>
          <input placeholder="Title" value={broadcast.title} onChange={(e)=>setBroadcast({...broadcast, title:e.target.value})} />
          <input placeholder="Message" value={broadcast.body} onChange={(e)=>setBroadcast({...broadcast, body:e.target.value})} />
          <button className="btn" onClick={async()=>{
            const r = await api.post('/admin/broadcast', broadcast)
            setSentInfo(`Sent to ${r.data?.data?.sent || 0} users`)
            setTimeout(()=>setSentInfo(''), 3000)
          }} disabled={!broadcast.title || !broadcast.body}>Send</button>
        </div>
        {sentInfo && <div style={{marginTop:8, color:'green'}}>{sentInfo}</div>}
      </div>

      <div className={`admin-cards ${view !== 'home' ? 'active' : ''}`} style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(260px, 1fr))', gap:16}}>
        <Card id="resume" activeCard={activeCard} title="Teacher Resume Reviews" body="View submitted teacher resumes for review." onOpen={async()=>{ setActiveCard('resume'); setView('resume'); await openList() }} />
        <Card id="approved" activeCard={activeCard} title="Approved Teachers" body="List of verified teachers." onOpen={async()=>{ setActiveCard('approved'); setView('approved'); await loadApprovedTeachers() }} />
        <Card id="students" activeCard={activeCard} title="Students" body="See ecoPoints, details, enrollments, activity." onOpen={async()=>{ setActiveCard('students'); setView('students'); await loadStudents() }} />
        <Card id="content" activeCard={activeCard} title="Content Review" body="All courses, quizzes, assignments, materials." onOpen={async()=>{ setActiveCard('content'); setView('content'); await loadContent() }} />
        <Card id="notifications" activeCard={activeCard} title="Notifications Center" body="Announcements, message student/teacher by email." onOpen={()=>{ setActiveCard('notifications'); setView('notifications') }} />
        <Card id="community" activeCard={activeCard} title="Community" body="Open common chat space for all roles." onOpen={()=> window.open('/community', '_blank')} />
        <Card id="leaderboard" activeCard={activeCard} title="Leaderboard Config" body="Pick winners and publish." onOpen={()=>{ setActiveCard('leaderboard'); setView('leaderboard') }} />
      </div>

      {(view==='resume') && (
        <div className="flyout-panel show">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
            <h4 style={{margin:0}}>Teacher Resume Reviews</h4>
            <button className="btn btn-outline" onClick={()=>{ setView('home'); setActiveCard(null) }}>Close</button>
          </div>
          {loading ? <div>Loading...</div> : (
            <div className="teacher-cards">
              {teachers.length === 0 && <div>No teacher submissions yet.</div>}
              {teachers.map(row => (
                <div key={row.teacher.id} className="teacher-card">
                  <div className="teacher-card-header">
                    <h5>{row.teacher.user.name}</h5>
                    <span className={`status-badge ${row.teacher.isApproved ? 'approved' : 'pending'}`}>
                      {row.teacher.isApproved ? 'Approved' : 'Pending Review'}
                    </span>
                  </div>
                  <div className="teacher-card-body">
                    <div className="teacher-details">
                      <div><strong>Email:</strong> {row.teacher.user.email}</div>
                      <div><strong>Qualification:</strong> {row.teacher.qualification || 'Not provided'}</div>
                      <div><strong>Contact:</strong> {row.teacher.contact || 'Not provided'}</div>
                      <div><strong>Details:</strong> {row.teacher.details || 'Not provided'}</div>
                    </div>
                    <div className="teacher-actions">
                      <button onClick={()=>viewResume(row.teacher.id)} className="btn btn-outline">View Resume</button>
                      <div className="approval-buttons">
                        <button 
                          onClick={()=>setApproval(row.teacher.id, true)} 
                          className="btn btn-success"
                          disabled={row.teacher.isApproved}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={()=>setApproval(row.teacher.id, false)} 
                          className="btn btn-danger"
                          disabled={!row.teacher.isApproved}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(view==='approved') && (
        <div className="flyout-panel show">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
            <h4 style={{margin:0}}>Approved Teachers</h4>
            <button className="btn btn-outline" onClick={()=>{ setView('home'); setActiveCard(null) }}>Close</button>
          </div>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Course Count</th></tr></thead>
            <tbody>
              {approvedTeachers.map(t => (
                <tr key={t.id}><td>{t.name}</td><td>{t.email}</td><td>{t.courseCount}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(view==='students') && (
        <div className="flyout-panel show">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
            <h4 style={{margin:0}}>Students</h4>
            <button className="btn btn-outline" onClick={()=>{ setView('home'); setActiveCard(null) }}>Close</button>
          </div>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>ecoPoints</th><th>Badges</th><th>Courses</th><th>Progress</th></tr></thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td>{s.student.name}</td>
                  <td>{s.student.email}</td>
                  <td>{s.student.ecoPoints}</td>
                  <td>{s.badgesCount}</td>
                  <td>{(s.enrolledCourses||[]).length}</td>
                  <td>{(s.progress||[]).map(p=>`${p.course?.title}: ${p.progressPercent||0}%`).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(view==='content') && (
        <div className="flyout-panel show">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
            <h4 style={{margin:0}}>Content Review</h4>
            <button className="btn btn-outline" onClick={()=>{ setView('home'); setActiveCard(null) }}>Close</button>
          </div>
          <table className="table">
            <thead><tr><th>Course</th><th>Teacher</th><th>Materials</th><th>Quizzes</th><th>Assignments</th><th>Open</th></tr></thead>
            <tbody>
              {content.map(c => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.teacher?.name} ({c.teacher?.email})</td>
                  <td>{c.materialsCount}</td>
                  <td>{c.quizzesCount}</td>
                  <td>{c.assignmentsCount}</td>
                  <td><a className="btn btn-outline" href={`/course/${c.id}`} target="_blank" rel="noreferrer">Open</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(view==='notifications') && (
        <div className="flyout-panel show">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
            <h4 style={{margin:0}}>Notifications Center</h4>
            <button className="btn btn-outline" onClick={()=>{ setView('home'); setActiveCard(null) }}>Close</button>
          </div>
          <div className="dashboard-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
            <div className="card" style={{border:'1px solid #e5e7eb', borderRadius:12, padding:12}}>
              <h5>Announcement</h5>
              <div className="auth-form">
                <input placeholder="Title" value={broadcast.title} onChange={(e)=>setBroadcast({...broadcast, title:e.target.value})} />
                <input placeholder="Message" value={broadcast.body} onChange={(e)=>setBroadcast({...broadcast, body:e.target.value})} />
                <select value={broadcast.audience} onChange={(e)=>setBroadcast({...broadcast, audience:e.target.value})}>
                  <option value="teachers">Teachers</option>
                  <option value="students">Students</option>
                  <option value="all">All</option>
                </select>
                <button className="btn" onClick={async()=>{
                  const r = await api.post('/admin/broadcast', broadcast)
                  setSentInfo(`Sent to ${r.data?.data?.sent || 0} users`)
                  setTimeout(()=>setSentInfo(''), 3000)
                }} disabled={!broadcast.title || !broadcast.body}>Send</button>
                {sentInfo && <div style={{color:'green'}}>{sentInfo}</div>}
              </div>
            </div>
            <TargetedMessageCard title="Message Student" placeholder="Student email" />
            <TargetedMessageCard title="Message Teacher" placeholder="Teacher email" />
          </div>
        </div>
      )}

      {(view==='leaderboard') && (
        <div className="flyout-panel show">
          <LeaderboardConfig onBack={()=>{ setView('home'); setActiveCard(null) }} />
        </div>
      )}
    </div>
  )
}

function Card({ title, body, onOpen }) {
  return (
    <div className="card" style={{border:'1px solid #e5e7eb', borderRadius:12, padding:16}}>
      <div className="card-title" style={{fontWeight:700}}>{title}</div>
      <div className="card-body" style={{color:'#444', margin:'8px 0'}}>{body}</div>
      <button className="btn" onClick={onOpen}>Open</button>
    </div>
  )
}

function Section({ title, onBack, children }) {
  return (
    <div style={{marginTop:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <h4 style={{margin:0}}>{title}</h4>
        <button className="btn btn-outline" onClick={onBack}>Back</button>
      </div>
      {children}
    </div>
  )
}

function TargetedMessageCard({ title, placeholder }) {
  const [form, setForm] = useState({ email: '', title: '', body: '' })
  const [ok, setOk] = useState('')
  return (
    <div className="card" style={{border:'1px solid #e5e7eb', borderRadius:12, padding:12}}>
      <h5>{title}</h5>
      <div className="auth-form">
        <input placeholder={placeholder} value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
        <input placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
        <input placeholder="Message" value={form.body} onChange={(e)=>setForm({...form, body:e.target.value})} />
        <button className="btn" onClick={async()=>{
          await api.post('/notifications/by-email', { recipientEmail: form.email, type: 'system', title: form.title, body: form.body })
          setOk('Sent!')
          setTimeout(()=>setOk(''), 2000)
        }} disabled={!form.email || !form.title || !form.body}>Send</button>
        {ok && <div style={{color:'green'}}>{ok}</div>}
      </div>
    </div>
  )
}

function LeaderboardConfig({ onBack }) {
  const [form, setForm] = useState({ winners: 3, minPoints: 0, period: 'weekly' })
  const [saved, setSaved] = useState('')
  return (
    <Section title="Leaderboard Config" onBack={onBack}>
      <div className="auth-form" style={{maxWidth:560}}>
        <label>Number of winners</label>
        <input type="number" value={form.winners} onChange={(e)=>setForm({...form, winners:Number(e.target.value)||0})} />
        <label>Minimum ecoPoints to be considered</label>
        <input type="number" value={form.minPoints} onChange={(e)=>setForm({...form, minPoints:Number(e.target.value)||0})} />
        <label>Period</label>
        <select value={form.period} onChange={(e)=>setForm({...form, period:e.target.value})}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button className="btn" onClick={async()=>{
          await api.post('/admin/leaderboard', form)
          setSaved('Saved and published!')
          setTimeout(()=>setSaved(''), 2000)
        }}>Save</button>
        {saved && <div style={{color:'green'}}>{saved}</div>}
      </div>
    </Section>
  )
}


