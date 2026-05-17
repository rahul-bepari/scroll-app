import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const IslandLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {/* Sky */}
    <rect x="0" y="0" width="100" height="100" rx="50" fill="#1a9fd4"/>
    {/* Sun */}
    <rect x="68" y="12" width="12" height="12" fill="#FFD700"/>
    <rect x="65" y="9" width="6" height="6" fill="#FFD700"/>
    <rect x="74" y="9" width="6" height="6" fill="#FFD700"/>
    <rect x="65" y="18" width="6" height="6" fill="#FFD700"/>
    <rect x="74" y="18" width="6" height="6" fill="#FFD700"/>
    {/* Clouds */}
    <rect x="12" y="15" width="18" height="8" rx="3" fill="white" opacity="0.9"/>
    <rect x="10" y="18" width="22" height="6" rx="2" fill="white" opacity="0.9"/>
    <rect x="38" y="10" width="14" height="7" rx="3" fill="white" opacity="0.85"/>
    <rect x="36" y="13" width="18" height="5" rx="2" fill="white" opacity="0.85"/>
    {/* Ocean */}
    <rect x="0" y="58" width="100" height="42" rx="0" fill="#0096c7"/>
    <rect x="0" y="88" width="100" height="12" rx="0" fill="#0077b6"/>
    {/* Shallow water */}
    <ellipse cx="50" cy="62" rx="34" ry="10" fill="#48cae4" opacity="0.7"/>
    {/* Island */}
    <ellipse cx="50" cy="62" rx="28" ry="8" fill="#f9c74f"/>
    <ellipse cx="50" cy="59" rx="22" ry="6" fill="#fde68a"/>
    {/* Water shimmer lines */}
    <rect x="8" y="68" width="14" height="2" rx="1" fill="#90e0ef" opacity="0.5"/>
    <rect x="78" y="72" width="14" height="2" rx="1" fill="#90e0ef" opacity="0.5"/>
    <rect x="6" y="76" width="10" height="1" rx="1" fill="#ade8f4" opacity="0.4"/>
    <rect x="82" y="80" width="10" height="1" rx="1" fill="#ade8f4" opacity="0.4"/>
    {/* === LEFT PALM TREE (pixel style) === */}
    {/* trunk */}
    <rect x="37" y="46" width="3" height="14" fill="#7c4a1e"/>
    <rect x="36" y="44" width="3" height="4" fill="#7c4a1e" transform="rotate(-5,37,50)"/>
    <rect x="35" y="38" width="3" height="8" fill="#6b3d15" transform="rotate(-8,37,46)"/>
    {/* coconuts */}
    <rect x="32" y="35" width="5" height="5" rx="2" fill="#5c3317"/>
    <rect x="38" y="33" width="4" height="4" rx="2" fill="#5c3317"/>
    {/* leaves left tree */}
    <rect x="18" y="30" width="18" height="3" rx="1" fill="#2d6a2d" transform="rotate(15,36,31)"/>
    <rect x="20" y="24" width="16" height="3" rx="1" fill="#3a8a3a" transform="rotate(35,36,25)"/>
    <rect x="34" y="20" width="16" height="3" rx="1" fill="#2d6a2d" transform="rotate(-20,34,21)"/>
    <rect x="34" y="26" width="18" height="3" rx="1" fill="#3a8a3a" transform="rotate(-40,34,27)"/>
    <rect x="24" y="34" width="14" height="2" rx="1" fill="#166534" transform="rotate(5,31,35)"/>
    {/* === RIGHT PALM TREE (pixel style) === */}
    {/* trunk */}
    <rect x="60" y="46" width="3" height="14" fill="#7c4a1e"/>
    <rect x="61" y="44" width="3" height="4" fill="#7c4a1e" transform="rotate(5,62,50)"/>
    <rect x="62" y="38" width="3" height="8" fill="#6b3d15" transform="rotate(8,62,46)"/>
    {/* coconuts */}
    <rect x="58" y="33" width="4" height="4" rx="2" fill="#5c3317"/>
    <rect x="63" y="35" width="5" height="5" rx="2" fill="#5c3317"/>
    {/* leaves right tree */}
    <rect x="64" y="30" width="18" height="3" rx="1" fill="#2d6a2d" transform="rotate(-15,64,31)"/>
    <rect x="64" y="24" width="16" height="3" rx="1" fill="#3a8a3a" transform="rotate(-35,64,25)"/>
    <rect x="50" y="20" width="16" height="3" rx="1" fill="#2d6a2d" transform="rotate(20,66,21)"/>
    <rect x="48" y="26" width="18" height="3" rx="1" fill="#3a8a3a" transform="rotate(40,66,27)"/>
    <rect x="62" y="34" width="14" height="2" rx="1" fill="#166534" transform="rotate(-5,69,35)"/>
    {/* === SAILBOAT === */}
    <rect x="10" y="56" width="14" height="3" rx="1" fill="#c8a87a"/>
    <rect x="16" y="44" width="2" height="13" fill="#7c5c3a"/>
    <polygon points="18,45 28,57 18,57" fill="white" opacity="0.92"/>
    <polygon points="16,48 10,56 16,56" fill="white" opacity="0.85"/>
    {/* Circle border */}
    <circle cx="50" cy="50" r="49" fill="none" stroke="#0077b6" strokeWidth="3"/>
  </svg>
);

export default function App() {
  const [page, setPage] = useState('feed');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [posts, setPosts] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [reg, setReg] = useState({ real_name:'', username:'', email:'', password:'' });
  const [showRegPass, setShowRegPass] = useState(false);
  const [msg, setMsg] = useState({ text:'', type:'' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const showMsg = (text, type='info') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:'', type:'' }), 4000);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchPosts = async () => {
    try { const r = await axios.get(`${API}/api/posts`); setPosts(r.data); } catch {}
  };
  const fetchPendingUsers = async () => {
    try { const r = await axios.get(`${API}/api/admin/pending-users`, authHeaders); setPendingUsers(r.data); } catch {}
  };
  const fetchPendingPosts = async () => {
    try { const r = await axios.get(`${API}/api/admin/pending-posts`, authHeaders); setPendingPosts(r.data); } catch {}
  };

  useEffect(() => { fetchPosts(); }, []);
  useEffect(() => {
    if (user?.is_admin && page === 'admin') { fetchPendingUsers(); fetchPendingPosts(); }
  }, [page]);

  const login = async () => {
    try {
      const r = await axios.post(`${API}/api/login`, { email: loginEmail.trim(), password: loginPass.trim() });
      setToken(r.data.token); setUser(r.data.user);
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(r.data.user));
      setLoginEmail(''); setLoginPass('');
      setPage('feed');
      showMsg(`Welcome back, @${r.data.user.username}!`, 'success');
    } catch (e) { showMsg(e.response?.data?.error || 'Login failed', 'error'); }
  };

  const register = async () => {
    if (!reg.real_name || !reg.username || !reg.email || !reg.password)
      return showMsg('All fields are required', 'error');
    try {
      await axios.post(`${API}/api/register`, reg);
      showMsg('Account created! Wait for admin approval then login.', 'success');
      setReg({ real_name:'', username:'', email:'', password:'' });
      setPage('login');
    } catch (e) { showMsg(e.response?.data?.error || 'Registration failed', 'error'); }
  };

  const logout = () => {
    setUser(null); setToken('');
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setPage('feed'); setSidebarOpen(false);
    showMsg('Signed out successfully', 'info');
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 4);
    setImages(newImages);
    setPreviews(newImages.map(f => URL.createObjectURL(f)));
    e.target.value = '';
  };

  const removeImage = (i) => {
    const ni = images.filter((_,idx) => idx !== i);
    setImages(ni);
    setPreviews(ni.map(f => URL.createObjectURL(f)));
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return showMsg('Write something first!', 'error');
    setLoading(true);
    const formData = new FormData();
    formData.append('caption', caption);
    images.forEach(img => formData.append('images', img));
    try {
      const r = await axios.post(`${API}/api/posts`, formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      showMsg(r.data.message, 'success');
      setCaption(''); setImages([]); setPreviews([]);
      fetchPosts(); setPage('feed');
    } catch (e) { showMsg(e.response?.data?.error || 'Failed to post', 'error'); }
    setLoading(false);
  };

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await axios.delete(`${API}/api/posts/${id}`, authHeaders);
      showMsg('Post deleted', 'info');
      fetchPosts();
    } catch (e) { showMsg('Failed to delete', 'error'); }
    setActiveMenu(null);
  };

  const startEdit = (post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
    setActiveMenu(null);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API}/api/posts/${id}`, { content: editContent }, authHeaders);
      showMsg('Post updated!', 'success');
      setEditingPost(null);
      fetchPosts();
    } catch (e) { showMsg('Failed to update', 'error'); }
  };

  const approveUser = async (id) => {
    await axios.put(`${API}/api/admin/approve-user/${id}`, {}, authHeaders);
    fetchPendingUsers(); showMsg('User approved!', 'success');
  };
  const rejectUser  = async (id) => { await axios.delete(`${API}/api/admin/reject-user/${id}`, authHeaders); fetchPendingUsers(); };
  const approvePost = async (id) => {
    await axios.put(`${API}/api/admin/approve-post/${id}`, {}, authHeaders);
    fetchPendingPosts(); fetchPosts(); showMsg('Post approved!', 'success');
  };
  const rejectPost  = async (id) => { await axios.delete(`${API}/api/admin/reject-post/${id}`, authHeaders); fetchPendingPosts(); };

  const navTo = (p) => { setPage(p); setSidebarOpen(false); setMsg({ text:'', type:'' }); setActiveMenu(null); };

  const avatarColor = (name) => {
    const c = ['#6c63ff','#e84393','#00b894','#f39c12','#e17055','#74b9ff','#a29bfe','#fd79a8'];
    return c[(name?.charCodeAt(0) || 0) % c.length];
  };

  const getPostImages = (post) => {
    if (!post.image_url) return [];
    try { const p = JSON.parse(post.image_url); return Array.isArray(p) ? p : [p]; }
    catch { return [post.image_url]; }
  };

  const timeAgo = (date) => {
    const s = Math.floor((new Date() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
  };

  const PhotoGrid = ({ urls }) => {
    if (!urls.length) return null;
    const n = Math.min(urls.length, 4);
    return (
      <div className={`photo-grid g${n}`}>
        {urls.slice(0,4).map((u,i) => (
          <div key={i} className="photo-item">
            <img src={u} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    );
  };

  const PostCard = ({ post }) => {
    const imgs = getPostImages(post);
    const isOwner = user && (user.id === post.user_id || user.is_admin);
    const isEditing = editingPost === post.id;

    return (
      <article className="post-card">
        <div className="post-head">
          <div className="post-avatar" style={{background: avatarColor(post.username)}}>
            {post.username?.[0]?.toUpperCase()}
          </div>
          <div className="post-meta">
            <span className="post-author">{post.real_name || post.username}</span>
            <span className="post-username">@{post.username} · {timeAgo(post.created_at)}</span>
          </div>
          {isOwner && (
            <div className="post-menu-wrap" ref={activeMenu === post.id ? menuRef : null}>
              <button className="post-menu-btn" onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}>
                ···
              </button>
              {activeMenu === post.id && (
                <div className="post-dropdown">
                  <button onClick={() => startEdit(post)}>✏️ Edit Post</button>
                  <button className="danger" onClick={() => deletePost(post.id)}>🗑️ Delete Post</button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="edit-box">
            <textarea className="edit-textarea" value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} autoFocus />
            <div className="edit-actions">
              <button className="btn-cancel" onClick={() => setEditingPost(null)}>Cancel</button>
              <button className="btn-save" onClick={() => saveEdit(post.id)}>Save</button>
            </div>
          </div>
        ) : (
          <p className="post-body">{post.content}</p>
        )}

        {imgs.length > 0 && <PhotoGrid urls={imgs} />}
      </article>
    );
  };

  const totalPending = pendingUsers.length + pendingPosts.length;

  return (
    <div className="app">
      {/* TOPBAR */}
      <nav className="topbar">
        <div className="topbar-left">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <div className="brand" onClick={() => navTo('feed')}>
            <IslandLogo size={34} />
            <span className="brand-name">Scroll</span>
          </div>
        </div>

        <div className="topbar-search desktop-only">
          <span className="search-icon">🔍</span>
          <input placeholder="Search posts..." readOnly className="search-input" />
        </div>

        <div className="topbar-right">
          <button className="icon-btn" onClick={() => setDark(!dark)} title="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              {user.is_admin && (
                <button className="icon-btn notif" onClick={() => navTo('admin')}>
                  🔔
                  {totalPending > 0 && <span className="notif-dot">{totalPending}</span>}
                </button>
              )}
              <div className="topbar-avatar" style={{background: avatarColor(user.username)}} onClick={() => navTo('post')}>
                {user.username?.[0]?.toUpperCase()}
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <button className="btn-ghost" onClick={() => navTo('login')}>Login</button>
              <button className="btn-primary" onClick={() => navTo('register')}>Join</button>
            </div>
          )}
        </div>
      </nav>

      {msg.text && <div className={`toast toast-${msg.type}`}>{msg.text}</div>}

      <div className="layout">
        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-inner">
            {user && (
              <div className="sidebar-profile">
                <div className="sidebar-avatar" style={{background: avatarColor(user.username)}}>
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <div className="sidebar-user-info">
                  <span className="sidebar-name">{user.real_name || user.username}</span>
                  <span className="sidebar-username">@{user.username}</span>
                </div>
              </div>
            )}
            <nav className="sidebar-nav">
              <button className={`sidebar-btn ${page==='feed'?'active':''}`} onClick={() => navTo('feed')}>
                <span className="sidebar-icon">⊞</span> Feed
              </button>
              {user && (
                <button className={`sidebar-btn ${page==='post'?'active':''}`} onClick={() => navTo('post')}>
                  <span className="sidebar-icon">⊕</span> Create Post
                </button>
              )}
              {user?.is_admin && (
                <button className={`sidebar-btn admin ${page==='admin'?'active':''}`} onClick={() => navTo('admin')}>
                  <span className="sidebar-icon">⚙</span> Admin
                  {totalPending > 0 && <span className="sidebar-badge">{totalPending}</span>}
                </button>
              )}
              {!user && (
                <>
                  <button className={`sidebar-btn ${page==='login'?'active':''}`} onClick={() => navTo('login')}>
                    <span className="sidebar-icon">→</span> Login
                  </button>
                  <button className={`sidebar-btn ${page==='register'?'active':''}`} onClick={() => navTo('register')}>
                    <span className="sidebar-icon">★</span> Join Now
                  </button>
                </>
              )}
            </nav>
            {user && (
              <div className="sidebar-footer">
                <button className="sidebar-btn logout" onClick={logout}>
                  <span className="sidebar-icon">⇥</span> Sign Out
                </button>
              </div>
            )}
          </div>
        </aside>

        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        <main className="main-content">
          {/* FEED */}
          {page === 'feed' && (
            <div className="feed-wrap">
              <div className="feed-col">
                <div className="feed-header">
                  <h2 className="feed-title">What's happening</h2>
                  {user && <button className="btn-primary" onClick={() => navTo('post')}>+ New Post</button>}
                </div>
                {posts.length === 0
                  ? <div className="empty-state">
                      <div className="empty-icon"><IslandLogo size={64}/></div>
                      <p>No posts yet. Be the first to share!</p>
                      {!user && <button className="btn-primary" onClick={() => navTo('register')}>Join Scroll</button>}
                    </div>
                  : posts.map(post => <PostCard key={post.id} post={post} />)
                }
              </div>

              {/* RIGHT PANEL */}
              <div className="right-panel desktop-only">
                <div className="panel-card" style={{textAlign:'center', paddingTop:'20px'}}>
                  <IslandLogo size={64}/>
                  <div style={{marginTop:'10px', fontWeight:'700', fontSize:'16px', color:'var(--text)'}}>Scroll</div>
                  <p className="panel-text" style={{marginTop:'6px'}}>A private community space. Share moments, stories, and travels with your people.</p>
                </div>
                {!user && (
                  <div className="panel-card cta-card">
                    <h3>Join the community</h3>
                    <p>Create an account to post and interact.</p>
                    <button className="btn-primary full" onClick={() => navTo('register')}>Get Started</button>
                    <button className="btn-ghost full mt8" onClick={() => navTo('login')}>Sign In</button>
                  </div>
                )}
                {user && (
                  <div className="panel-card">
                    <h3 className="panel-title">Quick Actions</h3>
                    <button className="panel-action" onClick={() => navTo('post')}>📝 Write a post</button>
                    <button className="panel-action" onClick={() => navTo('post')}>📷 Share photos</button>
                    {user.is_admin && <button className="panel-action" onClick={() => navTo('admin')}>⚙ Admin Panel {totalPending > 0 && `(${totalPending})`}</button>}
                  </div>
                )}
                <div className="panel-card">
                  <h3 className="panel-title">Stats</h3>
                  <div className="stat-row"><span>Total Posts</span><strong>{posts.length}</strong></div>
                  <div className="stat-row"><span>Community</span><strong>Scroll</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* LOGIN */}
          {page === 'login' && (
            <div className="auth-wrap">
              <div className="auth-box">
                <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}>
                  <IslandLogo size={72}/>
                </div>
                <div className="auth-logo" style={{fontSize:'26px',fontStyle:'italic',marginBottom:'4px'}}>Scroll</div>
                <h2>Welcome back</h2>
                <input className="field" placeholder="Email address" type="email"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                <div className="pass-wrap">
                  <input className="field" placeholder="Password"
                    type={showLoginPass ? 'text' : 'password'}
                    value={loginPass} onChange={e => setLoginPass(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && login()} />
                  <button className="pass-eye" onClick={() => setShowLoginPass(!showLoginPass)}>
                    {showLoginPass ? '🙈' : '👁'}
                  </button>
                </div>
                <button className="btn-primary full" onClick={login}>Sign In</button>
                <p className="auth-switch">New to Scroll? <span onClick={() => navTo('register')}>Create account</span></p>
              </div>
            </div>
          )}

          {/* REGISTER */}
          {page === 'register' && (
            <div className="auth-wrap">
              <div className="auth-box">
                <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}>
                  <IslandLogo size={72}/>
                </div>
                <div className="auth-logo" style={{fontSize:'26px',fontStyle:'italic',marginBottom:'4px'}}>Scroll</div>
                <h2>Join Scroll</h2>
                <input className="field" placeholder="Full name"
                  value={reg.real_name} onChange={e => setReg({...reg, real_name: e.target.value})} />
                <input className="field" placeholder="Username (shown publicly)"
                  value={reg.username} onChange={e => setReg({...reg, username: e.target.value})} />
                <input className="field" placeholder="Email address" type="email"
                  value={reg.email} onChange={e => setReg({...reg, email: e.target.value})} />
                <div className="pass-wrap">
                  <input className="field" placeholder="Password"
                    type={showRegPass ? 'text' : 'password'}
                    value={reg.password} onChange={e => setReg({...reg, password: e.target.value})} />
                  <button className="pass-eye" onClick={() => setShowRegPass(!showRegPass)}>
                    {showRegPass ? '🙈' : '👁'}
                  </button>
                </div>
                <button className="btn-primary full" onClick={register}>Create Account</button>
                <p className="auth-switch">Have account? <span onClick={() => navTo('login')}>Sign in</span></p>
              </div>
            </div>
          )}

          {/* CREATE POST */}
          {page === 'post' && user && (
            <div className="create-wrap">
              <div className="create-box">
                <div className="create-head">
                  <div className="post-avatar" style={{background: avatarColor(user.username)}}>
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="post-author">{user.real_name || user.username}</div>
                    <div className="post-username">@{user.username} {!user.is_admin && '· Needs approval'}</div>
                  </div>
                </div>
                <form onSubmit={submitPost}>
                  <textarea className="post-textarea"
                    placeholder="Share something with your community..."
                    value={caption} onChange={e => setCaption(e.target.value)} rows={5} />
                  {previews.length > 0 && (
                    <div className={`preview-grid p${previews.length}`}>
                      {previews.map((src,i) => (
                        <div key={i} className="preview-item">
                          <img src={src} alt="" />
                          <button type="button" className="remove-img" onClick={() => removeImage(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="post-actions">
                    <div className="post-actions-left">
                      <label className={`upload-label ${images.length >= 4 ? 'disabled' : ''}`}>
                        <input type="file" accept="image/*" multiple onChange={handleImages}
                          style={{display:'none'}} disabled={images.length >= 4} />
                        📷 {images.length === 0 ? 'Photos' : `${images.length}/4`}
                      </label>
                      <span className="char-count">{caption.length} chars</span>
                    </div>
                    <button className="btn-primary" type="submit" disabled={loading || !caption.trim()}>
                      {loading ? <span className="spinner" /> : user.is_admin ? '🚀 Publish' : '📤 Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ADMIN */}
          {page === 'admin' && user?.is_admin && (
            <div className="admin-wrap">
              <h2 className="admin-title">⚙ Admin Panel</h2>
              <div className="admin-stats">
                <div className="stat-card"><div className="stat-num">{posts.length}</div><div className="stat-label">Live Posts</div></div>
                <div className="stat-card"><div className="stat-num">{pendingUsers.length}</div><div className="stat-label">Pending Users</div></div>
                <div className="stat-card"><div className="stat-num">{pendingPosts.length}</div><div className="stat-label">Pending Posts</div></div>
              </div>
              <div className="admin-section">
                <h3>👥 Pending Users <span className="count-badge">{pendingUsers.length}</span></h3>
                {pendingUsers.length === 0
                  ? <p className="empty-small">No pending users ✓</p>
                  : pendingUsers.map(u => (
                    <div key={u.id} className="admin-row">
                      <div className="admin-avatar" style={{background: avatarColor(u.username)}}>{u.username?.[0]?.toUpperCase()}</div>
                      <div className="admin-info">
                        <strong>{u.real_name}</strong>
                        <span>@{u.username} · {u.email}</span>
                        <span className="admin-date">{new Date(u.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="admin-btns">
                        <button className="approve-btn" onClick={() => approveUser(u.id)}>✓ Approve</button>
                        <button className="reject-btn" onClick={() => rejectUser(u.id)}>✕ Reject</button>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="admin-section">
                <h3>📝 Pending Posts <span className="count-badge">{pendingPosts.length}</span></h3>
                {pendingPosts.length === 0
                  ? <p className="empty-small">No pending posts ✓</p>
                  : pendingPosts.map(p => {
                      const imgs = getPostImages(p);
                      return (
                        <div key={p.id} className="admin-row">
                          <div className="admin-avatar" style={{background: avatarColor(p.username)}}>{p.username?.[0]?.toUpperCase()}</div>
                          <div className="admin-info">
                            <strong>@{p.username}</strong>
                            <span>{p.content?.slice(0,100)}{p.content?.length > 100 ? '...' : ''}</span>
                            {imgs[0] && <img src={imgs[0]} className="admin-thumb" alt="" />}
                            <span className="admin-date">{new Date(p.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="admin-btns">
                            <button className="approve-btn" onClick={() => approvePost(p.id)}>✓ Approve</button>
                            <button className="reject-btn" onClick={() => rejectPost(p.id)}>✕ Reject</button>
                          </div>
                        </div>
                      );
                    })
                }
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}