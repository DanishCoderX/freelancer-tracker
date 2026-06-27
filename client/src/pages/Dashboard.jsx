import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Filler } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Filler);

const StatCard = ({ label, value, sub, accent }) => (
  <div className="card flex flex-col gap-1">
    <span className="text-xs text-ink-muted uppercase tracking-wide">{label}</span>
    <span className={`text-2xl lg:text-3xl font-bold font-mono break-all ${accent || 'text-ink'}`}>{value}</span>
    {sub && <span className="text-xs text-ink-faint">{sub}</span>}
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = {
    labels: stats?.monthlyEarnings.map((m) => m.label) || [],
    datasets: [{
      label: 'Earnings (PKR)',
      data: stats?.monthlyEarnings.map((m) => m.amount) || [],
      backgroundColor: 'rgba(99,102,241,0.6)',
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` PKR ${ctx.raw.toLocaleString()}` } } },
    scales: {
      x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', callback: (v) => `${v / 1000}k` } },
    },
  };

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'morning' : today.getHours() < 17 ? 'afternoon' : 'evening';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-ink">
          Good {greeting}, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-ink-muted text-sm mt-1">Here's what's happening with your work.</p>
      </div>

      {/* Stat cards - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard label="Total Earned" value={`PKR ${(stats?.totalEarned || 0).toLocaleString()}`} accent="text-success" />
        <StatCard label="Pending" value={`PKR ${(stats?.totalPending || 0).toLocaleString()}`} accent="text-warning" />
        <StatCard label="Active Projects" value={stats?.activeProjects || 0} sub={`${stats?.completedProjects || 0} completed`} />
        <StatCard label="Clients" value={stats?.totalClients || 0} sub="total" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Chart */}
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink mb-4">Earnings — last 6 months</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Upcoming deadlines */}
        <div className="card">
          <h2 className="text-sm font-semibold text-ink mb-4">Upcoming Deadlines</h2>
          {stats?.upcomingDeadlines?.length === 0 ? (
            <p className="text-ink-faint text-sm">No deadlines in the next 7 days.</p>
          ) : (
            <ul className="space-y-3">
              {stats?.upcomingDeadlines?.map((p) => {
                const daysLeft = Math.ceil((new Date(p.deadline) - new Date()) / 86400000);
                return (
                  <li key={p._id} className="flex items-start justify-between gap-2">
                    <span className="text-sm text-ink truncate">{p.title}</span>
                    <span className={`badge shrink-0 ${daysLeft <= 2 ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>{daysLeft}d</span>
                  </li>
                );
              })}
            </ul>
          )}
          <Link to="/projects" className="block mt-4 text-xs text-primary hover:underline">View all projects →</Link>
        </div>
      </div>
    </div>
  );
}
