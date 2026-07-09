import { useEffect, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import { SelectField, TextInput } from '../../components/Field';
import { useApp } from '../../context/AppContext';
import { adminApi } from '../../lib/adminApi';

const roles = ['customer', 'admin'];

export default function AdminCustomersPage() {
  const { auth } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');
  const [formMap, setFormMap] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.users(auth.token);
      setUsers(Array.isArray(data) ? data : []);
      const next = {};
      (Array.isArray(data) ? data : []).forEach((user) => {
        next[user._id] = {
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'customer',
        };
      });
      setFormMap(next);
    } catch (err) {
      setError(err.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) loadData();
  }, [auth?.token]);

  const updateUser = async (id) => {
    try {
      setSavingId(id);
      setError('');
      await adminApi.updateUser(auth.token, id, formMap[id]);
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to update user');
    } finally {
      setSavingId('');
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      setSavingId(id);
      setError('');
      await adminApi.deleteUser(auth.token, id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to delete user');
    } finally {
      setSavingId('');
    }
  };

  return (
    <AdminPageShell title="Users" description="Monitor customer and admin accounts, engagement, and access roles.">
      {error ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading users...</div> : null}
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user._id} className="rounded-3xl bg-white p-6 shadow-card">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_140px_120px] lg:items-end">
              <TextInput
                value={formMap[user._id]?.name || ''}
                onChange={(event) => setFormMap((current) => ({ ...current, [user._id]: { ...current[user._id], name: event.target.value } }))}
                placeholder="Name"
              />
              <TextInput
                value={formMap[user._id]?.email || ''}
                onChange={(event) => setFormMap((current) => ({ ...current, [user._id]: { ...current[user._id], email: event.target.value } }))}
                placeholder="Email"
              />
              <SelectField
                value={formMap[user._id]?.role || 'customer'}
                onChange={(event) => setFormMap((current) => ({ ...current, [user._id]: { ...current[user._id], role: event.target.value } }))}
              >
                {roles.map((role) => <option key={role}>{role}</option>)}
              </SelectField>
              <div className="flex gap-2">
                <Button onClick={() => updateUser(user._id)} disabled={savingId === user._id}>Save</Button>
                <Button variant="secondary" onClick={() => removeUser(user._id)} disabled={savingId === user._id}>Delete</Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-text/60">
              <span>{user.orderCount || 0} orders</span>
              <span>${user.lifetimeValue || 0} lifetime value</span>
              <span>{user.role}</span>
            </div>
          </div>
        ))}
        {!users.length && !loading ? <div className="rounded-3xl bg-white p-6 shadow-card">No users found.</div> : null}
      </div>
    </AdminPageShell>
  );
}
