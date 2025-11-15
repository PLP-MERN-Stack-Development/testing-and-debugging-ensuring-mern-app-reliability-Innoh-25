import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bugService from '../services/bugService';
import './BugList.css';

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      // If user is present, request only their bugs so they see their history
      const params = user ? { mine: true } : {};
      const response = await bugService.getBugs(params);
      // API may return an array directly or an object like { bugs: [...] }
      const items = Array.isArray(response) ? response : (response.bugs || []);
      setBugs(items);
    } catch (err) {
      setError('Failed to fetch bugs');
      console.error('Error fetching bugs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBug = async (bugId) => {
    if (!window.confirm('Are you sure you want to delete this bug?')) return;
    
    try {
      await bugService.deleteBug(bugId);
      setBugs(bugs.filter(bug => bug._id !== bugId));
    } catch (err) {
      setError('Failed to delete bug');
      console.error('Error deleting bug:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  if (loading) return <div className="loading">Loading bugs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bug-list">
      <div className="bug-list-header">
        <h1>Bug Reports</h1>
        {user && (
          <Link to="/bugs/new" className="btn btn-primary">
            Report New Bug
          </Link>
        )}
      </div>

      {bugs.length === 0 ? (
        <div className="no-bugs">
          <p>No bugs reported yet.</p>
          {user && (
            <Link to="/bugs/new" className="btn btn-primary">
              Report First Bug
            </Link>
          )}
        </div>
      ) : (
        <div className="bugs-grid">
          {bugs.map(bug => (
            <div key={bug._id} className="bug-card">
              <div className="bug-header">
                <h3 className="bug-title">{bug.title}</h3>
                <div className="bug-meta">
                  <span className={`status-badge ${getStatusBadgeClass(bug.status)}`}>
                    {bug.status}
                  </span>
                  <span className={`priority-badge ${getPriorityBadgeClass(bug.priority)}`}>
                    {bug.priority}
                  </span>
                </div>
              </div>
              
              <p className="bug-description">{bug.description}</p>
              
              <div className="bug-footer">
                <div className="bug-info">
                  <span>Reported by: {bug.reporter?.username || 'Unknown'}</span>
                  <span>Created: {new Date(bug.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="bug-actions">
                  <Link to={`/bugs/edit/${bug._id}`} className="btn btn-secondary btn-sm">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteBug(bug._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;