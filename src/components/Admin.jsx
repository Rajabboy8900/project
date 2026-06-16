import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import '../styles/admin.css';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'skills', 'blogs', 'messages', 'analytics'

  // Data States
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [visitorLogs, setVisitorLogs] = useState([]);

  // Form States
  const [projectForm, setProjectForm] = useState({ 
    id: null, 
    title: '', 
    description: '', 
    longDescription: '', 
    tags: '', 
    link: '#', 
    githubLink: '', 
    imageUrl: '/icon.png' 
  });
  
  const [skillForm, setSkillForm] = useState({ id: null, name: '', category: 'Backend' });
  
  const [blogForm, setBlogForm] = useState({
    id: null,
    title: '',
    summary: '',
    content: '',
    category: 'Backend',
    readTime: 3
  });

  // Scroll to form helper
  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

    // Fetch blogs
    fetch(`${API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error(err));

    // Fetch messages
    fetchWithAuth(`${API_URL}/api/messages`)
      .then((res) => {
        if (res.status === 401) handleLogout();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch((err) => console.error(err));

    // Fetch analytics
    fetchWithAuth(`${API_URL}/api/analytics`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err));

    // Fetch visitor logs
    if (activeTab === 'analytics') {
      fetchWithAuth(`${API_URL}/api/analytics/logs`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setVisitorLogs(data);
        })
        .catch((err) => console.error(err));
    }
  }, [token, activeTab]);

  // Project CRUD
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
        setProjectForm({ id: null, title: '', description: '', longDescription: '', tags: '', link: '#', githubLink: '', imageUrl: '/icon.png' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Skill CRUD
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
      const res = await fetchWithAuth(`${API_URL}/api/skills/${id}`, { method: 'DELETE' });
      if (res.ok) setSkills(skills.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Blog CRUD
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!blogForm.id;
    const url = isEdit 
      ? `${API_URL}/api/blogs/${blogForm.id}`
      : `${API_URL}/api/blogs`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...blogForm, readTime: Number(blogForm.readTime) }),
      });
      if (res.ok) {
        const saved = await res.json();
        if (isEdit) {
          setBlogs(blogs.map((b) => (b.id === blogForm.id ? saved : b)));
        } else {
          setBlogs([...blogs, saved]);
        }
        setBlogForm({ id: null, title: '', summary: '', content: '', category: 'Backend', readTime: 3 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Message Delete
  const handleMessageDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Login Page Render
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
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
            />
            <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>Login</button>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem', textDecoration: 'none' }}>&larr; Back to Portfolio</a>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-dashboard">
        <div className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your portfolio items, blog posts, and track views</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#" className="btn-secondary" style={{ textDecoration: 'none' }}>View Site</a>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
            Projects ({projects.length})
          </button>
          <button className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
            Skills ({skills.length})
          </button>
          <button className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>
            Blogs ({blogs.length})
          </button>
          <button className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            Messages ({messages.length})
          </button>
          <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            Analytics
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
                  placeholder="Tags (comma separated: NestJS,PostgreSQL)"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  required
                  style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <textarea
                  placeholder="Short Description"
                  rows="2"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                ></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <textarea
                  placeholder="Long Detailed Description (Supports details about architecture, ERD, etc.)"
                  rows="4"
                  value={projectForm.longDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                ></textarea>
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Demo Link (URL)"
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="GitHub Source Link (URL)"
                  value={projectForm.githubLink}
                  onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                  style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Image URL (screenshot path or /icon.png)"
                  value={projectForm.imageUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                  style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>
                    {projectForm.id ? 'Update Project' : 'Add Project'}
                  </button>
                  {projectForm.id && (
                    <button type="button" className="btn-secondary" onClick={() => setProjectForm({ id: null, title: '', description: '', longDescription: '', tags: '', link: '#', githubLink: '', imageUrl: '/icon.png' })}>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>{project.tags}</td>
                      <td>
                        <div className="action-btns">
                          <button 
                            className="btn-edit"
                            onClick={() => {
                              setProjectForm({
                                id: project.id,
                                title: project.title,
                                description: project.description,
                                longDescription: project.longDescription || '',
                                tags: project.tags,
                                link: project.link,
                                githubLink: project.githubLink || '',
                                imageUrl: project.imageUrl || '/icon.png',
                              });
                              scrollToForm();
                            }}
                          >
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleProjectDelete(project.id)}>Delete</button>
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
                  <button type="button" className="btn-secondary" onClick={() => setSkillForm({ id: null, name: '', category: 'Backend' })}>
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
                            onClick={() => {
                              setSkillForm({
                                id: skill.id,
                                name: skill.name,
                                category: skill.category,
                              });
                              scrollToForm();
                            }}
                          >
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleSkillDelete(skill.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BLOGS TAB */}
        {activeTab === 'blogs' && (
          <div>
            <form onSubmit={handleBlogSubmit} className="admin-form">
              <h3>{blogForm.id ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  required
                  style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Category"
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    required
                    style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                  />
                  <input
                    type="number"
                    placeholder="Read Time (min)"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    required
                    style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Blog Short Summary"
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <textarea
                  placeholder="Blog Content (Supports Markdown: ### Headers, code blocks, bullet points)"
                  rows="8"
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', fontFamily: 'monospace' }}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                {blogForm.id && (
                  <button type="button" className="btn-secondary" onClick={() => setBlogForm({ id: null, title: '', summary: '', content: '', category: 'Backend', readTime: 3 })}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary">
                  {blogForm.id ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Read Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>{blog.title}</td>
                      <td>{blog.category}</td>
                      <td>{blog.readTime} min</td>
                      <td>
                        <div className="action-btns">
                          <button 
                            className="btn-edit"
                            onClick={() => {
                              setBlogForm({
                                id: blog.id,
                                title: blog.title,
                                summary: blog.summary,
                                content: blog.content,
                                category: blog.category,
                                readTime: blog.readTime,
                              });
                              scrollToForm();
                            }}
                          >
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleBlogDelete(blog.id)}>Delete</button>
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
                    <button className="btn-delete" onClick={() => handleMessageDelete(message.id)}>Delete</button>
                  </div>
                  <div className="message-body">{message.message}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div>
            {analytics ? (
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h4>Total Page Views</h4>
                  <div className="stat-value">{analytics.pageViews}</div>
                </div>
                <div className="analytics-card">
                  <h4>Telegram Clicks</h4>
                  <div className="stat-value">{analytics.telegramClicks}</div>
                </div>
                <div className="analytics-card">
                  <h4>GitHub Clicks</h4>
                  <div className="stat-value">{analytics.githubClicks}</div>
                </div>
                <div className="analytics-card">
                  <h4>LinkedIn Clicks</h4>
                  <div className="stat-value">{analytics.linkedinClicks}</div>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Loading analytics stats...</p>
            )}

            {/* Dynamic visitor breakdown stats */}
            {visitorLogs && visitorLogs.length > 0 && (
              <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', color: '#fff' }}>Visitor Breakdown</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '1.5rem' }}>
                    <h4 style={{ color: 'var(--accent-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>Devices</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Object.entries(
                        visitorLogs.reduce((acc, log) => {
                          acc[log.device] = (acc[log.device] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([device, count]) => (
                        <li key={device} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>{device}</span>
                          <span style={{ fontWeight: 'bold', color: '#fff' }}>{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '1.5rem' }}>
                    <h4 style={{ color: 'var(--accent-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>Operating Systems</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Object.entries(
                        visitorLogs.reduce((acc, log) => {
                          acc[log.os] = (acc[log.os] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([os, count]) => (
                        <li key={os} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>{os}</span>
                          <span style={{ fontWeight: 'bold', color: '#fff' }}>{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '1.5rem' }}>
                    <h4 style={{ color: 'var(--accent-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>Browsers</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Object.entries(
                        visitorLogs.reduce((acc, log) => {
                          acc[log.browser] = (acc[log.browser] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([browser, count]) => (
                        <li key={browser} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>{browser}</span>
                          <span style={{ fontWeight: 'bold', color: '#fff' }}>{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Visitor logs table */}
            <div style={{ marginTop: '2.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem', color: '#fff' }}>Recent Visitor Logs (Last 50)</h3>
              {visitorLogs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No visitor log records found.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>IP Address</th>
                        <th>Device</th>
                        <th>OS</th>
                        <th>Browser</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorLogs.map((log) => (
                        <tr key={log.id}>
                          <td style={{ fontFamily: 'monospace', color: 'var(--accent-light)' }}>{log.ip}</td>
                          <td>
                            <span style={{ 
                              background: log.device === 'Mobile' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)', 
                              color: log.device === 'Mobile' ? '#f87171' : '#38bdf8', 
                              padding: '0.2rem 0.6rem', 
                              borderRadius: '4px',
                              fontSize: '0.85rem'
                            }}>
                              {log.device}
                            </span>
                          </td>
                          <td>{log.os}</td>
                          <td>{log.browser}</td>
                          <td style={{ fontSize: '0.9rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
