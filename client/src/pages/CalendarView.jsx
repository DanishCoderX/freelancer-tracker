import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../services/api';

export default function CalendarView() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(new Date());

  useEffect(() => { api.get('/projects').then((r) => setProjects(r.data)); }, []);

  const deadlineMap = projects.reduce((map, p) => {
    if (!p.deadline) return map;
    const key = new Date(p.deadline).toDateString();
    if (!map[key]) map[key] = [];
    map[key].push(p);
    return map;
  }, {});

  const selectedProjects = deadlineMap[selected.toDateString()] || [];

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const items = deadlineMap[date.toDateString()];
    if (!items) return null;
    return (
      <div className="flex justify-center mt-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const items = deadlineMap[date.toDateString()];
    if (!items) return '';
    const hasOverdue = items.some((p) => p.status !== 'completed' && new Date(p.deadline) < new Date());
    return hasOverdue ? 'has-overdue' : 'has-deadline';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-ink">Calendar</h1>
        <p className="text-ink-muted text-sm mt-1">Project deadlines at a glance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="card overflow-hidden">
          <style>{`
            .react-calendar { width: 100%; background: transparent; border: none; font-family: inherit; }
            .react-calendar__tile { color: #f1f5f9; background: transparent; border-radius: 8px; padding: 6px 4px; font-size: 13px; }
            .react-calendar__tile:hover { background: #334155; }
            .react-calendar__tile--now { background: rgba(99,102,241,0.15) !important; color: #a5b4fc !important; }
            .react-calendar__tile--active { background: #6366f1 !important; color: white !important; }
            .react-calendar__navigation button { color: #94a3b8; background: transparent; font-size: 13px; }
            .react-calendar__navigation button:hover { background: #334155; border-radius: 8px; }
            .react-calendar__month-view__weekdays { color: #475569; font-size: 10px; text-transform: uppercase; }
            .react-calendar__month-view__weekdays abbr { text-decoration: none; }
            .has-deadline { border: 1px solid rgba(99,102,241,0.4); }
            .has-overdue { border: 1px solid rgba(239,68,68,0.4); }
          `}</style>
          <Calendar onChange={setSelected} value={selected} tileContent={tileContent} tileClassName={tileClassName} />
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-ink mb-4">
            {selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          {selectedProjects.length === 0 ? (
            <p className="text-ink-faint text-sm">No deadlines on this day.</p>
          ) : (
            <ul className="space-y-3">
              {selectedProjects.map((p) => {
                const isOverdue = new Date(p.deadline) < new Date() && p.status !== 'completed';
                return (
                  <li key={p._id} className="p-3 bg-surface rounded-lg border border-surface-border">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm text-ink truncate">{p.title}</span>
                      <span className={`badge shrink-0 ${p.status === 'completed' ? 'bg-primary/10 text-primary' : isOverdue ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                        {isOverdue ? 'overdue' : p.status}
                      </span>
                    </div>
                    {p.clientId?.name && <p className="text-xs text-ink-muted mt-1">{p.clientId.name}</p>}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-6">
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">All Upcoming</h3>
            <ul className="space-y-2">
              {projects
                .filter((p) => p.deadline && p.status !== 'completed')
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 6)
                .map((p) => {
                  const daysLeft = Math.ceil((new Date(p.deadline) - new Date()) / 86400000);
                  return (
                    <li key={p._id} className="flex items-center justify-between text-sm">
                      <span className="text-ink truncate max-w-[160px]">{p.title}</span>
                      <span className={`text-xs ${daysLeft < 0 ? 'text-danger' : daysLeft <= 3 ? 'text-warning' : 'text-ink-muted'}`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
