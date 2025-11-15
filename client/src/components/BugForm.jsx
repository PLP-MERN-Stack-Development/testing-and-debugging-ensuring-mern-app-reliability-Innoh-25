import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bugService from '../services/bugService';
import './BugForm.css';

const BugForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    project: '',
    stepsToReproduce: [''],
    environment: {
      os: '',
      browser: '',
      version: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchBug();
    }
  }, [id, isEditing]);

  const fetchBug = async () => {
    try {
      const bug = await bugService.getBugById(id);
      setFormData({
        title: bug.title || '',
        description: bug.description || '',
        status: bug.status || 'open',
        priority: bug.priority || 'medium',
        project: bug.project || '',
        stepsToReproduce: bug.stepsToReproduce || [''],
        environment: bug.environment || {
          os: '',
          browser: '',
          version: ''
        }
      });
    } catch (err) {
      setError('Failed to fetch bug details');
      console.error('Error fetching bug:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnvironmentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      environment: {
        ...prev.environment,
        [name]: value
      }
    }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.stepsToReproduce];
    newSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      stepsToReproduce: newSteps
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      stepsToReproduce: [...prev.stepsToReproduce, '']
    }));
  };

  const removeStep = (index) => {
    if (formData.stepsToReproduce.length > 1) {
      const newSteps = formData.stepsToReproduce.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        stepsToReproduce: newSteps
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Filter out empty steps
      const filteredSteps = formData.stepsToReproduce.filter(step => step.trim() !== '');
      
      const submitData = {
        ...formData,
        stepsToReproduce: filteredSteps.length > 0 ? filteredSteps : ['']
      };

      if (isEditing) {
        await bugService.updateBug(id, submitData);
      } else {
        await bugService.createBug(submitData);
      }
      
      navigate('/bugs');
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} bug`);
      console.error('Error submitting bug:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to {isEditing ? 'edit' : 'report'} bugs.</p>
      </div>
    );
  }

  return (
    <div className="bug-form">
      <h1>{isEditing ? 'Edit Bug' : 'Report New Bug'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength="10"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="project">Project *</label>
          <input
            type="text"
            id="project"
            name="project"
            value={formData.project}
            onChange={handleChange}
            required
            placeholder="e.g., Frontend, Backend, Mobile App"
          />
        </div>

        <div className="form-group">
          <label>Steps to Reproduce</label>
          {formData.stepsToReproduce.map((step, index) => (
            <div key={index} className="step-input">
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
              />
              {formData.stepsToReproduce.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="btn btn-secondary btn-sm"
          >
            Add Step
          </button>
        </div>

        <div className="form-group">
          <label>Environment Details</label>
          <div className="environment-fields">
            <input
              type="text"
              name="os"
              value={formData.environment.os}
              onChange={handleEnvironmentChange}
              placeholder="Operating System"
            />
            <input
              type="text"
              name="browser"
              value={formData.environment.browser}
              onChange={handleEnvironmentChange}
              placeholder="Browser"
            />
            <input
              type="text"
              name="version"
              value={formData.environment.version}
              onChange={handleEnvironmentChange}
              placeholder="Version"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/bugs')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Bug' : 'Report Bug')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugForm;