import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function NavBar() {
  const { profile, logout } = useAuth();

  return (
    <>
      <header className="top-nav">
        <Link to="/" className="top-nav-logo">Instaclone</Link>
        <button className="icon-btn" onClick={logout} aria-label="Log out">⎋</button>
      </header>

      <nav className="bottom-nav">
        <Link to="/" className="icon-btn" aria-label="Home">⌂</Link>
        <Link to="/create" className="icon-btn" aria-label="New post">+</Link>
        <Link to={`/profile/${profile?.username}`} className="icon-btn" aria-label="Profile">
          <img
            className="avatar avatar-xs"
            src={profile?.avatar_url || '/default-avatar.png'}
            alt="Profile"
          />
        </Link>
      </nav>
    </>
  );
}
