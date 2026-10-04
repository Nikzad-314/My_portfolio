import { useEffect, useState } from 'react'
import './App.css'

type GitHubProfile = {
  login: string
  name: string | null
  bio: string | null
  location: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
}

type GitHubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  fork: boolean
}

const username = 'Nikzad-314'
const knownProjects: GitHubRepo[] = [
  { id: 1, name: 'Nikzad_Private_School', description: 'A school project built with Python.', html_url: `https://github.com/${username}/Nikzad_Private_School`, language: 'Python', stargazers_count: 0, forks_count: 0, updated_at: '2026-08-20', fork: false },
  { id: 2, name: 'flightBooking', description: 'A flight booking project built with JavaScript.', html_url: `https://github.com/${username}/flightBooking`, language: 'JavaScript', stargazers_count: 0, forks_count: 0, updated_at: '2025-07-12', fork: false },
  { id: 3, name: 'php', description: 'PHP projects and experiments.', html_url: `https://github.com/${username}/php`, language: 'PHP', stargazers_count: 0, forks_count: 0, updated_at: '2026-06-14', fork: false },
  { id: 4, name: 'php_assignment', description: 'A collection of PHP coursework assignments.', html_url: `https://github.com/${username}/php_assignment`, language: 'PHP', stargazers_count: 0, forks_count: 0, updated_at: '2024-10-21', fork: false },
]

function Icon({ name, size = 18 }: { name: 'arrow' | 'github' | 'sun' | 'moon' | 'menu' | 'close' | 'external' | 'code' | 'pin' | 'sparkle'; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  const paths = {
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    github: <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.2-.4-3.8 1.4a13 13 0 0 0-6.9 0C5.4 1.1 4.2 1.5 4.2 1.5a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.1 6.4 6.1 6.7a3.4 3.4 0 0 0-.9 2.7V22" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    external: <><path d="M14 3h7v7m-1-6L10 14" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
    code: <><path d="m8 17-5-5 5-5m8 0 5 5-5 5m-2-12-4 14" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function App() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [projects, setProjects] = useState<GitHubRepo[]>(knownProjects)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('portfolio-theme') as 'dark' | 'light') || 'dark')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const controller = new AbortController()
    async function loadGitHub() {
      try {
        const [profileResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { signal: controller.signal }),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { signal: controller.signal }),
        ])
        if (!profileResponse.ok || !reposResponse.ok) throw new Error('GitHub profile is temporarily unavailable')
        const user: GitHubProfile = await profileResponse.json()
        const repos: GitHubRepo[] = await reposResponse.json()
        setProfile(user)
        const sorted = repos.filter((repo) => !repo.fork).sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
        if (sorted.length) setProjects(sorted.slice(0, 4))
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') console.info('Showing saved GitHub project details.')
      } finally {
        setLoading(false)
      }
    }
    void loadGitHub()
    return () => controller.abort()
  }, [])

  const displayName = profile?.name || 'Abdulhaq Nikzad'
  const navItems = [['About', '#about'], ['Projects', '#projects'], ['Skills', '#skills'], ['Contact', '#contact']]

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Abdulhaq Nikzad home"><span className="wordmark-mark">A</span><span>abdulhaq<span className="wordmark-dot">.</span></span></a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} size={21} /></button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <button className="theme-toggle" type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} /></button>
          <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk <Icon name="arrow" size={14} /></a>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> AVAILABLE TO CONNECT <span className="eyebrow-line" /></div>
            <h1>Thoughtful code.<br /><span>Useful experiences.</span></h1>
            <p className="hero-intro">Hi, I’m <strong>{displayName}</strong> — a developer learning, building, and improving one project at a time.</p>
            <div className="hero-actions"><a className="button button-primary" href="#projects">Explore my work <Icon name="arrow" size={16} /></a><a className="button button-quiet" href="#about">A little about me <span aria-hidden="true">↓</span></a></div>
            <div className="hero-social"><a href={`https://github.com/${username}`} target="_blank" rel="noreferrer"><Icon name="github" size={16} /> GitHub profile <Icon name="arrow" size={13} /></a><span className="social-divider" />{profile?.location && <span><Icon name="pin" size={15} /> {profile.location}</span>}</div>
          </div>
          <div className="hero-art" aria-label="Developer profile card">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="profile-card">
              <div className="card-top"><span className="card-label"><span className="status-dot" /> DEV PROFILE</span><Icon name="sparkle" size={17} /></div>
              <div className="avatar-wrap">{profile?.avatar_url ? <img src={profile.avatar_url} alt={`${displayName} GitHub avatar`} /> : <div className="avatar-fallback">AN</div>}<span className="avatar-status" /></div>
              <h2>{displayName}</h2><p className="profile-handle">@{username}</p>
              <div className="profile-divider" />
              <div className="profile-stats"><div><strong>{profile?.public_repos ?? 4}</strong><span>PUBLIC REPOS</span></div><div><strong>{profile?.followers ?? 3}</strong><span>FOLLOWERS</span></div></div>
              <a className="profile-link" href={`https://github.com/${username}`} target="_blank" rel="noreferrer">View GitHub profile <Icon name="arrow" size={14} /></a>
            </div>
            <div className="floating-chip chip-top"><span className="chip-icon purple"><Icon name="code" size={16} /></span><span><strong>Learning by building</strong><small>Every day, a little better</small></span></div>
            <div className="floating-chip chip-bottom"><span className="chip-icon lime"><Icon name="sparkle" size={16} /></span><span><strong>Keep it up</strong><small>Curiosity in progress</small></span></div>
          </div>
          <a href="#about" className="scroll-note"><span className="scroll-line" /> SCROLL TO EXPLORE</a>
        </section>

        <section className="about-section section-wrap" id="about">
          <div className="section-heading"><span className="section-index">01 / ABOUT</span><h2>Building my skills,<br /><span>one idea at a time.</span></h2></div>
          <div className="about-content"><p className="about-lead">I’m a developer from {profile?.location || 'Afghanistan'} who enjoys turning ideas into practical projects and learning through hands-on work.</p><p className="about-body">From school tools to booking experiences, I’m exploring how thoughtful design and clear code can make everyday tasks simpler. This portfolio brings my public work together in one place.</p><a href={`https://github.com/${username}`} className="text-link" target="_blank" rel="noreferrer">More about my journey <Icon name="arrow" size={15} /></a></div>
        </section>

        <section className="projects-section section-wrap" id="projects">
          <div className="section-heading projects-heading"><div><span className="section-index">02 / SELECTED WORK</span><h2>Things I’ve <span>built.</span></h2></div><a className="text-link all-projects" href={`https://github.com/${username}?tab=repositories`} target="_blank" rel="noreferrer">All repositories <Icon name="arrow" size={15} /></a></div>
          <div className="project-grid" aria-live="polite">
            {projects.map((project, index) => <article className="project-card" key={project.id}>
              <div className={`project-art project-art-${index + 1}`}><span className="project-count">0{index + 1}</span><div className="project-glyph"><Icon name={index % 2 === 0 ? 'code' : 'sparkle'} size={30} /></div><span className="project-open"><Icon name="arrow" size={18} /></span></div>
              <div className="project-info"><div className="project-meta"><span>{project.language || 'PROJECT'}</span><span className="project-updated">UPDATED {new Date(project.updated_at).getFullYear()}</span></div><h3>{project.name.replaceAll('_', ' ')}</h3><p>{project.description || projectDescription(project.name)}</p><div className="project-footer"><span className="language-dot" />{project.language || 'Open source'}<a href={project.html_url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}><Icon name="external" size={16} /></a></div></div>
            </article>)}
          </div>
          {loading && <p className="loading-note"><span className="loading-dot" /> Syncing public projects from GitHub…</p>}
        </section>

        <section className="skills-section section-wrap" id="skills">
          <div className="section-heading"><span className="section-index">03 / TOOLKIT</span><h2>What I’m working <span>with.</span></h2></div>
          <div className="skills-content"><p>Tools I’ve been learning and using across my public projects.</p><div className="skill-list"><span>JavaScript</span><span>Python</span><span>PHP</span><span>Git & GitHub</span><span>HTML & CSS</span><span>Problem solving</span></div></div>
        </section>

        <section className="contact-section section-wrap" id="contact"><div className="contact-glow" /><span className="section-index">04 / SAY HELLO</span><h2>Have an idea?<br /><span>Let’s make it real.</span></h2><p>I’m always glad to connect, learn, and talk about what’s next.</p><a className="button button-primary" href={`https://github.com/${username}`} target="_blank" rel="noreferrer"><Icon name="github" size={17} /> Find me on GitHub <Icon name="arrow" size={15} /></a></section>
      </main>

      <footer className="site-footer section-wrap"><a className="wordmark" href="#home"><span className="wordmark-mark">A</span><span>abdulhaq<span className="wordmark-dot">.</span></span></a><span>Designed with care · Built to keep growing</span><a href="#home" className="back-top">BACK TO TOP ↑</a></footer>
    </div>
  )
}

function projectDescription(name: string) {
  const descriptions: Record<string, string> = {
    Nikzad_Private_School: 'A school project built with Python, focused on bringing useful tools together.',
    flightBooking: 'A JavaScript project exploring the flow of searching and booking flights.',
    php: 'A collection of PHP work and experiments.',
    php_assignment: 'PHP assignments and practice projects.',
  }
  return descriptions[name] || 'An independent project. Visit the repository to explore the code and details.'
}

export default App
