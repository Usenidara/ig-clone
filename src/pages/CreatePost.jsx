import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

export default function CreatePost() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError('Choose an image first.');
      return;
    }
    setSubmitting(true);
    setError('');

    const ext = file.name.split('.').pop();
    const path = `${profile.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setSubmitting(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(path);

    const { error: insertError } = await supabase.from('posts').insert({
      user_id: profile.id,
      image_url: urlData.publicUrl,
      caption
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    navigate('/');
  }

  return (
    <div className="create-post">
      <h2>New post</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        {preview && <img src={preview} alt="Preview" className="post-preview" />}
        <textarea
          placeholder="Write a caption…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Posting…' : 'Share'}
        </button>
      </form>
    </div>
  );
}
