// d:\projects\personal-projects\to-do-list\client\src\pages\StatsPage.jsx
import React, { useEffect, useState } from 'react';
import { getTodoStatsApi } from '../api/todos.api';
import PageWrapper from '../components/layout/PageWrapper';
import Spinner from '../components/common/Spinner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const PRIORITY_COLORS = {
  HIGH: '#ef4444', // red-500
  MEDIUM: '#f59e0b', // amber-500
  LOW: '#22c55e', // green-500
};

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getTodoStatsApi();
        setStats(data);
      } catch (err) {
        setError('Failed to load stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <PageWrapper><Spinner /></PageWrapper>;
  if (error) return <PageWrapper><div className="text-red-500 text-center mt-10">{error}</div></PageWrapper>;
  if (!stats) return null;

  // Format data for PieChart
  const pieData = [
    { name: 'High', value: stats.byPriority.HIGH, color: PRIORITY_COLORS.HIGH },
    { name: 'Medium', value: stats.byPriority.MEDIUM, color: PRIORITY_COLORS.MEDIUM },
    { name: 'Low', value: stats.byPriority.LOW, color: PRIORITY_COLORS.LOW },
  ].filter(item => item.value > 0); // Don't show empty slices

  // Format data for BarChart (we want nicer date labels if possible, but the string is fine)
  const barData = stats.completedByDay.map(d => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }) // e.g., "Mon"
  })).reverse(); // Reverse so chronological order is left-to-right

  return (
    <PageWrapper>
      <div className="mt-8 mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Your Productivity Stats
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">See how much you've accomplished.</p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Tasks" value={stats.totalTodos} />
        <StatCard title="Completed" value={stats.completedTodos} />
        <StatCard title="Active" value={stats.activeTodos} />
        <StatCard title="Completion Rate" value={`${stats.completionRate}%`} />
      </div>

      {/* Due Soon / Overdue Pills */}
      <div className="flex justify-center gap-4 mb-8">
        <div className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-semibold shadow-sm">
          {stats.overdueCount} Overdue
        </div>
        <div className="px-4 py-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-sm font-semibold shadow-sm">
          {stats.upcomingCount} Due Soon (7 days)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart: Completed per day */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Tasks Completed (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="displayDate" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(99, 102, 241, 0.1)'}} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Tasks by Priority */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Tasks by Priority</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                No active tasks to show.
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// Helper component for summary cards
const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
    <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{value}</p>
  </div>
);

export default StatsPage;

// ✅ DONE
