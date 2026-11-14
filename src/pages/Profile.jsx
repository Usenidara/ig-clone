import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

export default function Profile() {
  const { username } = useParams();
  const { profile: myProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = myProfile?.username === username;

  const load = useCallback(async () => {
    setLoading(true);
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (!userProfile) {
      setLoading(false);
      return;
    }
    setProfile(userProfile);

    const { data: userPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });
    setPosts(userPosts || []);

    if (!isOwnProfile) {
      const { data: followRow } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', myProfile.id)
        .eq('following_id', userProfile.id)
        .maybeSingle();
      setIsFollowing(!!followRow);
    }

    setLoading(false);
  }, [username, myProfile, isOwnProfile]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleFollow() {
    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', myProfile.id)
        .eq('following_id', profile.id);
      setIsFollowing(false);
    } else {
      await supabase.from('follows').insert({
        follower_id: myProfile.id,
        following_id: profile.id
      });
      setIsFollowing(true);
    }
  }

  if (loading) return <div className="loading-screen">Loading…</div>;
  if (!profile) return <div className="loading-screen">User not found.</div>;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img
          className="avatar avatar-lg"
          src={profile.avatar_url || '/default-avatar.png'}
          alt={profile.username}
        />
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.display_name}</p>
          {!isOwnProfile && (
            <button className="follow-btn" onClick={toggleFollow}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </header>

      <div className="profile-grid">
        {posts.map((post) => (
          <img key={post.id} src={post.image_url} alt={post.caption || 'Post'} />
        ))}
      </div>
    </div>
  );
}
