import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    age: '',
    height: '',
    weight: '',
    goal: '',
    fitnessLevel: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/user/profile');
        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.put('/user/profile', profile);
      alert('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error && !saving) return <div>{error}</div>;

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Age:</label>
          <input type="number" name="age" value={profile.age} onChange={handleChange} required />
        </div>
        <div>
          <label>Height (cm):</label>
          <input type="number" name="height" value={profile.height} onChange={handleChange} required />
        </div>
        <div>
          <label>Weight (kg):</label>
          <input type="number" name="weight" value={profile.weight} onChange={handleChange} required />
        </div>
        <div>
          <label>Goal:</label>
          <input type="text" name="goal" value={profile.goal} onChange={handleChange} required />
        </div>
        <div>
          <label>Fitness Level:</label>
          <select name="fitnessLevel" value={profile.fitnessLevel} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Profile;
