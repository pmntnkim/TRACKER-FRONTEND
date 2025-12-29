import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalWorkouts: 0, totalMinutes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('/workouts/summary');
        setSummary(response.data);
      } catch (err) {
        setError('Failed to fetch workout summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Workouts: {summary.totalWorkouts}</p>
      <p>Total Minutes Exercised: {summary.totalMinutes}</p>
    </div>
  );
};

export default Dashboard;
