import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import '../styles/admin.css';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'skills', 'messages'

  // Data States
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);

  // Form States
  const [projectForm, setProjectForm] = useState({ id: null, title: '', description: '', tags: '', link: '#' });
  const [skillForm, setSkillForm] = useState({ id: null, name: '', category: 'Backend' });

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUsername('');
        setPassword('');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection to backend failed');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  // Generic fetch wrapper with auth token
  const fetchWithAuth = (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Load Admin Data
  useEffect(() => {
    if (!token) return;

    // Fetch projects
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));

    // Fetch skills
    fetch(`${API_URL}/api/skills`)
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error(err));

    // Fetch messages
    fetchWithAuth(`${API_URL}/api/messages`)
      .then((res) => {
        if (res.status === 401) {
          handleLogout();
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch((err) => console.error(err));
  }, [token]);

  // Project CRUD operations
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!projectForm.id;
    const url = isEdit 
      ? `${API_URL}/api/projects/${projectForm.id}`
      : `${API_URL}/api/projects`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });
      if (res.ok) {
        const saved = await res.json();
        if (isEdit) {
          setProjects(projects.map((p) => (p.id === projectForm.id ? saved : p)));
        } else {
          setProjects([...projects, saved]);
        }
        setProjectForm({ id: null, title: '', description: '', tags: '', link: '#' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Skill CRUD operations
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!skillForm.id;
    const url = isEdit 
      ? `${API_URL}/api/skills/${skillForm.id}`
      : `${API_URL}/api/skills`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillForm),
      });
      if (res.ok) {
        const saved = await res.json();
        if (isEdit) {
          setSkills(skills.map((s) => (s.id === skillForm.id ? saved : s)));
        } else {
          setSkills([...skills, saved]);
        }
        setSkillForm({ id: null, name: '', category: 'Backend' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkillDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/api/skills/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Message Delete
  const handleMessageDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/api/messages/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Render Login Page
  if (!token) {
    return (
      <div className="admin-panel">
        <motion.div 
          className="login-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Admin Panel Login</h2>
          {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>Login</button>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem', textDecoration: 'none' }}>&larr; Back to Portfolio</a>
          </form>
        </motion.div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="admin-panel">
      <div className="admin-dashboard">
        <div className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage portfolio items and view messages</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#" className="btn-secondary" style={{ textDecoration: 'none' }}>View Site</a>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects ({projects.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills ({skills.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages ({messages.length})
          </button>
        </div>

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div>
            <form onSubmit={handleProjectSubmit} className="admin-form">
              <h3>{projectForm.id ? 'Edit Project' : 'Add New Project'}</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  required
                  style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated: Node.js,TypeScript)"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  required
                  style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <textarea
                  placeholder="Project Description"
                  rows="3"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                ></textarea>
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Link (e.g. GitHub url)"
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>
                    {projectForm.id ? 'Update Project' : 'Add Project'}
                  </button>
                  {projectForm.id && (
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setProjectForm({ id: null, title: '', description: '', tags: '', link: '#' })}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Tags</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>{project.tags}</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.description}
                      </td>
                      <td>
                        <div className="action-btns">
                          <button 
                            className="btn-edit"
                            onClick={() => setProjectForm({
                              id: project.id,
                              title: project.title,
                              description: project.description,
                              tags: project.tags,
                              link: project.link,
                            })}
                          >
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleProjectDelete(project.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div>
            <form onSubmit={handleSkillSubmit} className="admin-form">
              <h3>{skillForm.id ? 'Edit Skill' : 'Add New Skill'}</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Skill Name (e.g. Docker)"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  required
                  style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  required
                  style={{ padding: '0.8rem', background: '#121212', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Backend">Backend</option>
                  <option value="Databases">Databases</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                {skillForm.id && (
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setSkillForm({ id: null, name: '', category: 'Backend' })}
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary">
                  {skillForm.id ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill) => (
                    <tr key={skill.id}>
                      <td>{skill.name}</td>
                      <td>{skill.category}</td>
                      <td>
                        <div className="action-btns">
                          <button 
                            className="btn-edit"
                            onClick={() => setSkillForm({
                              id: skill.id,
                              name: skill.name,
                              category: skill.category,
                            })}
                          >
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleSkillDelete(skill.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div>
            {messages.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No messages received yet.</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="message-card">
                  <div className="message-header">
                    <div className="message-meta">
                      <h4>{message.name} ({message.email})</h4>
                      <span>{new Date(message.createdAt).toLocaleString()}</span>
                    </div>
                    <button className="btn-delete" onClick={() => handleMessageDelete(message.id)}>
                      Delete
                    </button>
                  </div>
                  <div className="message-body">{message.message}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
