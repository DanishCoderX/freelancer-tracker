import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Modal from '../components/Modal';

const STATUS_COLORS = {
  active: 'bg-success/10 text-success',
  completed: 'bg-primary/10 text-primary',
  paused: 'bg-warning/10 text-warning',
};

const EMPTY = { clientId: '', title: '', description: '', status: 'active', deadline: '', totalAmount: '', paidAmount: '' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchAll = async () => {
    const [p, c] = await Promise.all([api.get('/projects'), api.get('/clients')]);
    setProjects(p.data);
    setClients(c.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (p) => {
    setForm({
      clientId: p.clientId?._id || '',
      title: p.title,
      description: p.description || '',
      status: p.status,
      deadline: p.deadline ? p.deadline.slice(0, 10) : '',
      totalAmount: p.totalAmount || '',
      paidAmount: p.paidAmount || '',
    });
    setModal(p);
  };
  const closeModal = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, totalAmount: Number(form.totalAmount) || 0, paidAmount: Number(form.paidAmount) || 0 };
      if (modal === 'add') {
        const res = await api.post('/projects', payload);
        setProjects([res.data, ...projects]);
        toast.success('Project created');
      } else {
        const res = await api.put(`/projects/${modal._id}`, payload);
        setProjects(projects.map((p) => (p._id === modal._id ? res.data : p)));
        toast.success('Project updated');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Error deleting'); }
  };

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Projects</h1>
          <p className="text-ink-muted text-sm mt-1">{projects.length} total</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ New Project</button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'paused', 'completed'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
              filter === s ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink bg-surface-card border border-surface-border'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-ink-muted">No projects found.</p>
          <button className="btn-primary mt-4" onClick={openAdd}>Create your first project</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((p) => {
            const pct = p.totalAmount > 0 ? Math.round((p.paidAmount / p.totalAmount) * 100) : 0;
            const daysLeft = p.deadline
              ? Math.ceil((new Date(p.deadline) - new Date()) / 86400000)
              : null;
            return (
              <div key={p._id} className="card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-ink">{p.title}</h3>
                      <span className={`badge ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {p.clientId?.name}{p.clientId?.company ? ` · ${p.clientId.company}` : ''}
                    </p>
                    {p.description && <p className="text-sm text-ink-faint mt-1">{p.description}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="btn-ghost text-xs" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn-danger text-xs" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>

                {/* Payment bar */}
                <div>
                  <div className="flex justify-between text-xs text-ink-muted mb-1">
                    <span>Payment — PKR {(p.paidAmount || 0).toLocaleString()} / {(p.totalAmount || 0).toLocaleString()}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {daysLeft !== null && (
                  <p className={`text-xs ${daysLeft < 0 ? 'text-danger' : daysLeft <= 3 ? 'text-warning' : 'text-ink-faint'}`}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'New Project' : 'Edit Project'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">Client *</label>
              <select className="input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
                <option value="">Select a client</option>
                {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Project Title *</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="label">Deadline</label>
                <input className="input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Total (PKR)</label>
                <input className="input" type="number" min="0" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} />
              </div>
              <div>
                <label className="label">Paid (PKR)</label>
                <input className="input" type="number" min="0" value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} />
              </div>
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