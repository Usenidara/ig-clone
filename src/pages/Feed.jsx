import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import PostCard from '../components/PostCard';

export default function Feed() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);

  const loadFeed = useCallback(async () => {
    if (!profile) return;
    setLoading(true);

    const { data: feedPosts, error } = await supabase.rpc('get_feed', {
      p_user_id: profile.id,
      p_limit: 20
    });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setPosts(feedPosts || []);

    const authorIds = [...new Set((feedPosts || []).map((p) => p.user_id))];
    if (authorIds.length) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', authorIds);
      const map = {};
      (profiles || []).forEach((p) => (map[p.id] = p));
      setAuthors(map);
    }

    setLoading(false);
  }, [profile]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  if (loading) return <div className="loading-screen">Loading feed…</div>;

  if (posts.length === 0) {
    return (
      <div className="empty-feed">
        <p>No posts yet.</p>
        <p>Follow some accounts, or create your first post.</p>
      </div>
    );
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} author={authors[post.user_id]} />
      ))}
    </div>
  );
}
