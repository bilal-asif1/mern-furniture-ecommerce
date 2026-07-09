import { useEffect, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import { Field, TextInput } from '../../components/Field';
import { useApp } from '../../context/AppContext';
import { authApi } from '../../lib/adminApi';

export default function AdminProfilePage() {
  const { auth, login } = useApp();
  const [form, setForm] = useState({ name: '', email: '', avatar: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await authApi.me(auth.token);
        setForm({
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || '',
          password: '',
        });
      } catch (err) {
        setError(err.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) load();
  }, [auth?.token]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const payload = {
        name: form.name,
        email: form.email,
        avatar: form.avatar,
      };
      if (form.password) payload.password = form.password;
      const data = await authApi.updateProfile(auth.token, payload);
      login({
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        token: data.token,
      });
      setSuccess('Profile updated successfully');
      setForm((current) => ({ ...current, password: '' }));
    } catch (err) {
      setError(err.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageShell title="Profile Settings" description="Update admin account details and store preferences.">
      {error ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="mb-4 rounded-3xl bg-green-50 px-5 py-4 text-sm text-green-700">{success}</div> : null}
      {loading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading profile...</div> : null}
      <form onSubmit={submit} className="max-w-2xl rounded-3xl bg-white p-6 shadow-card">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name"><TextInput value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></Field>
          <Field label="Email"><TextInput value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></Field>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Avatar URL"><TextInput value={form.avatar} onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))} /></Field>
          <Field label="New Password"><TextInput value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" /></Field>
        </div>
        <Button className="mt-6" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </AdminPageShell>
  );
}
