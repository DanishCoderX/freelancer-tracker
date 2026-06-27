const Project = require('../models/Project');
const Client = require('../models/Client');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [projects, totalClients] = await Promise.all([
      Project.find({ userId }),
      Client.countDocuments({ userId }),
    ]);

    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'active').length;
    const completedProjects = projects.filter((p) => p.status === 'completed').length;

    const totalEarned = projects.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const totalPending = projects.reduce(
      (sum, p) => sum + ((p.totalAmount || 0) - (p.paidAmount || 0)),
      0
    );

    // Upcoming deadlines (next 7 days)
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = projects
      .filter((p) => p.deadline && p.deadline >= now && p.deadline <= in7Days && p.status === 'active')
      .sort((a, b) => a.deadline - b.deadline)
      .slice(0, 5)
      .map((p) => ({ _id: p._id, title: p.title, deadline: p.deadline }));

    // Monthly earnings for the last 6 months
    const monthlyEarnings = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();

      const earned = projects
        .filter((p) => {
          const d = new Date(p.updatedAt);
          return d.getFullYear() === year && d.getMonth() === month && p.paidAmount > 0;
        })
        .reduce((sum, p) => sum + p.paidAmount, 0);

      monthlyEarnings.push({
        label: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        amount: earned,
      });
    }

    res.json({
      totalClients,
      totalProjects,
      activeProjects,
      completedProjects,
      totalEarned,
      totalPending,
      upcomingDeadlines,
      monthlyEarnings,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getStats };