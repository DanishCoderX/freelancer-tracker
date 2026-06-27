import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Modal from '../components/Modal';

const EMPTY = { name: '', email: '', phone: '', company: '' };

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchClients = () => api.get('/clients').then((r) => setClients(r.data)).finally(() => setLoading(false));
  useEffect(() => { fetchClients(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (c) => { setForm({ name: c.name, email: c.email || '', phone: c.phone || '', company: c.company || '' }); setModal(c); };
  const closeModal = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        const res = await api.post('/clients', form);
        setClients([res.data, ...clients]);
        toast.success('Client added');
      } else {
        const res = await api.put(`/clients/${modal._id}`, form);
        setClients(clients.map((c) => (c._id === modal._id ? res.data : c)));
        toast.success('Client updated');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving client');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      await api.delete(`/clients/${id}`);
      setClients(clients.filter((c) => c._id !== id));
      toast.success('Client deleted');
    } catch { toast.error('Error deleting client'); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-ink">Clients</h1>
          <p className="text-ink-muted text-sm mt-1">{clients.length} client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary text-sm" onClick={openAdd}>+ Add Client</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-ink-muted">No clients yet.</p>
          <button className="btn-primary mt-4" onClick={openAdd}>Add your first client</button>
        </div>
      ) : (
        <div className="grid gap-3">
          {clients.map((c) => (
            <div key={c._id} className="card flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-ink text-sm truncate">{c.name}</p>
                  <p className="text-xs text-ink-muted truncate">{[c.company, c.email].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="btn-ghost text-xs px-2 py-1" onClick={() => openEdit(c)}>Edit</button>
                <button className="btn-danger text-xs px-2 py-1" onClick={() => handleDelete(c._id)}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Client' : 'Edit Client'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">Name *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
