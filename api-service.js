/**
 * API Service
 * ===========
 * Centralized API client for backend integration
 */

class APIService {
  constructor(baseURL = window.location.origin) {
    this.baseURL = baseURL;
  }

  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: { 'Content-Type': 'application/json' },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`API Error at ${endpoint}:`, err);
      throw err;
    }
  }

  // ===== JOBS API =====
  async getJobs(country = null) {
    const query = country ? `?country=${encodeURIComponent(country)}` : '';
    return this.fetch(`/api/jobs${query}`);
  }

  async getJob(id) {
    return this.fetch(`/api/jobs/${id}`);
  }

  async applyToJob(jobId, applicantData) {
    return this.fetch(`/api/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicantData)
    });
  }

  // ===== AGENTS API =====
  async registerAgent(agentData) {
    return this.fetch('/api/agents/register', {
      method: 'POST',
      body: JSON.stringify(agentData)
    });
  }

  async loginAgent(email, password) {
    return this.fetch('/api/agents/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getAgentProfile(agentId, token) {
    return this.fetch(`/api/agents/${agentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async submitCandidate(agentId, candidateData, token) {
    return this.fetch(`/api/agents/${agentId}/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(candidateData)
    });
  }

  async getAgentCandidates(agentId, token) {
    return this.fetch(`/api/agents/${agentId}/candidates`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async getAgentCommissions(agentId, token) {
    return this.fetch(`/api/agents/${agentId}/commissions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // ===== HEALTH CHECK =====
  async health() {
    return this.fetch('/api/health');
  }
}

// Initialize globally
window.api = new APIService();

// Health check on load
document.addEventListener('DOMContentLoaded', () => {
  window.api.health()
    .then(() => console.log('✓ Backend API is online'))
    .catch(() => console.warn('⚠ Backend API unavailable - using demo mode'));
});
