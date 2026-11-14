import { Link } from 'react-router-dom';

export default function PostCard({ post, author }) {
  return (
    <article className="post-card">
      <header className="post-header">
        <Link to={`/profile/${author?.username}`} className="post-author">
          <img
            className="avatar avatar-sm"
            src={author?.avatar_url || '/default-avatar.png'}
            alt={author?.username}
          />
          <span className="username">{author?.username || 'unknown'}</span>
        </Link>
        <button className="icon-btn" aria-label="More options">⋯</button>
      </header>

      <div className="post-image-wrap">
        <img className="post-image" src={post.image_url} alt={post.caption || 'Post'} />
      </div>

      <div className="post-actions">
        <button className="icon-btn" aria-label="Like">♡</button>
        <button className="icon-btn" aria-label="Comment">💬</button>
        <button className="icon-btn" aria-label="Share">➤</button>
      </div>

      {post.caption && (
        <p className="post-caption">
          <Link to={`/profile/${author?.username}`} className="username">
            {author?.username}
          </Link>{' '}
          {post.caption}
        </p>
      )}

      <p className="post-timestamp">{new Date(post.created_at).toLocaleDateString()}</p>
    </article>
  );
}
