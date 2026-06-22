import { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  CloudRain, 
  Ship, 
  Newspaper, 
  MapPin, 
  TrendingUp, 
  Clock,
  Sparkles,
  Percent
} from 'lucide-react';
import { triggerAnalysis, login } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Logistical Parameter Inputs
  const [location, setLocation] = useState('Seattle');
  const [keyword, setKeyword] = useState('Semiconductors');
  const [portId, setPortId] = useState('PORT-001');

  useEffect(() => {
    // Automatic admin login for session credentials on load
    login('admin', 'admin123').catch(err => {
      console.error("Login failed", err);
      setError('Authentication failed. Ensure backend service is running on http://localhost:8000');
    });
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await triggerAnalysis(location, keyword, portId);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to connect to backend server. Verify server status.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score < 0.3) return 'safe';
    if (score < 0.7) return 'warn';
    return 'danger';
  };

  const getFactorSeverity = (factor) => {
    const lower = factor.toLowerCase();
    if (lower.includes('severe') || lower.includes('high') || lower.includes('danger') || lower.includes('strike')) {
      return 'high';
    }
    if (lower.includes('warn') || lower.includes('medium') || lower.includes('elevated') || lower.includes('congestion')) {
      return 'medium';
    }
    return 'low';
  };

  // Helper to find raw supplier statistics in the normalized state
  const findSupplierStats = (supplierId) => {
    if (!data?.state?.suppliers) return null;
    return data.state.suppliers.find(s => s.supplier_id === supplierId);
  };

  // Circumference logic for SVG donut chart (radius = 80)
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const riskScore = data?.prediction?.score ?? 0.0;
  const strokeDashoffset = circumference - (riskScore * circumference);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-badge">
          <span className="pulse-dot"></span>
          Live Signal Monitor
        </div>
        <h1>Supply Chain Oracle</h1>
        <p className="subtitle">AI-Powered Disruption Prediction & Mitigation Command Center</p>
      </header>

      {/* Inputs panel */}
      <div className="glass-panel controls-bar stagger-1">
        <div className="input-group">
          <label className="input-label" htmlFor="location-input">Location</label>
          <input 
            id="location-input"
            type="text" 
            className="input-field" 
            placeholder="Location" 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="keyword-input">Keyword</label>
          <input 
            id="keyword-input"
            type="text" 
            className="input-field" 
            placeholder="Keyword" 
            value={keyword} 
            onChange={e => setKeyword(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="port-input">Port ID</label>
          <input 
            id="port-input"
            type="text" 
            className="input-field" 
            placeholder="Port ID" 
            value={portId} 
            onChange={e => setPortId(e.target.value)} 
          />
        </div>
        <button 
          className="btn-primary" 
          onClick={handleAnalyze} 
          disabled={loading}
          style={{ marginTop: '16px' }}
        >
          {loading ? 'Analyzing Signals...' : 'Run Diagnostics'}
        </button>
      </div>

      {error && (
        <div className="glass-panel error-banner stagger-2">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="glass-panel loading-container stagger-2">
          <div className="loading-spinner"></div>
          <span className="loading-text">Ingesting web signals, parsing logistics manifests & running prediction models...</span>
        </div>
      )}

      {!loading && !data && (
        <div className="glass-panel empty-state stagger-2">
          <div className="empty-state-icon">
            <Activity size={36} />
          </div>
          <h3>System Idle</h3>
          <p>Provide location, search keyword, and port parameter inputs above to check supply chain vulnerability metrics.</p>
        </div>
      )}

      {data && !loading && (
        <div className="results-section">
          <div className="metrics-grid">
            {/* Donut Chart Score panel */}
            <div className="glass-panel score-indicator stagger-2">
              <div className="score-ring-container">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle
                    className="score-ring-bg"
                    cx="90"
                    cy="90"
                    r={radius}
                  />
                  <circle
                    className={`score-ring-progress ${getScoreClass(riskScore)}`}
                    cx="90"
                    cy="90"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="score-value">
                  <span className={`score-number ${getScoreClass(riskScore)}`}>
                    {Math.round(riskScore * 100)}
                  </span>
                  <span className="score-label-small">Vulnerability Index</span>
                </div>
              </div>
              <h3 className="score-title">Risk Assessment</h3>
              <p className="score-summary">
                {data.prediction.summary}
              </p>
            </div>

            {/* Risk Factors panel */}
            <div className="glass-panel stagger-3">
              <div className="section-header">
                <div className="icon-wrapper warning">
                  <AlertTriangle size={20} />
                </div>
                <h3>Identified Risk Factors</h3>
              </div>
              <ul className="factor-list">
                {data.prediction.risk_factors.map((factor, idx) => (
                  <li key={idx} className="factor-item">
                    <span className={`factor-dot ${getFactorSeverity(factor)}`}></span>
                    <span style={{ flexGrow: 1 }}>{factor}</span>
                    <span className={`status-chip ${getFactorSeverity(factor) === 'high' ? 'danger' : getFactorSeverity(factor) === 'medium' ? 'warn' : 'safe'}`}>
                      {getFactorSeverity(factor).toUpperCase()}
                    </span>
                  </li>
                ))}
                {data.prediction.risk_factors.length === 0 && (
                  <li className="factor-empty">
                    <CheckCircle size={16} color="var(--success)" />
                    <span>No disruption triggers detected in current signals.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Signal Ingestion Panel (Full Width) */}
            <div className="glass-panel full-width stagger-3">
              <div className="section-header">
                <div className="icon-wrapper info">
                  <Sparkles size={20} />
                </div>
                <h3>Ingested & Normalized Live Signals</h3>
              </div>
              <div className="metrics-grid-3">
                {/* Weather Signal */}
                {data.state.weather.map((w, idx) => (
                  <div key={idx} className="rec-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <div className="rec-header">
                      <span className="rec-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CloudRain size={16} color="var(--primary)" /> Weather Signal
                      </span>
                      <span className={`status-chip ${w.severity === 'SEVERE' ? 'danger' : w.severity === 'WARNING' ? 'warn' : 'safe'}`}>
                        {w.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Location: <strong style={{ color: 'var(--on-surface)' }}>{w.location}</strong>
                    </p>
                    <p className="rec-reason" style={{ fontSize: '0.85rem' }}>{w.description}</p>
                  </div>
                ))}

                {/* Logistics Signal */}
                {data.state.logistics.map((l, idx) => (
                  <div key={idx} className="rec-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <div className="rec-header">
                      <span className="rec-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Ship size={16} color="var(--secondary)" /> Port Logistics
                      </span>
                      <span className={`status-chip ${l.congestion_level > 80 ? 'danger' : l.congestion_level > 50 ? 'warn' : 'safe'}`}>
                        {l.congestion_level > 80 ? 'Critical' : l.congestion_level > 50 ? 'Moderate' : 'Stable'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Port ID: <strong style={{ color: 'var(--on-surface)' }}>{l.port_id}</strong>
                    </p>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
                        <span>Congestion</span>
                        <span>{l.congestion_level}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${l.congestion_level}%`, 
                          height: '100%', 
                          background: l.congestion_level > 80 ? 'var(--danger)' : l.congestion_level > 50 ? 'var(--warning)' : 'var(--success)'
                        }}></div>
                      </div>
                    </div>
                    <p className="rec-reason" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Avg Delay: {l.avg_delay_days} days
                    </p>
                  </div>
                ))}

                {/* News Signal */}
                {data.state.news.map((n, idx) => (
                  <div key={idx} className="rec-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <div className="rec-header">
                      <span className="rec-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Newspaper size={16} color="var(--tertiary)" /> News Sentiment
                      </span>
                      <span className={`status-chip ${n.risk_level === 'HIGH' ? 'danger' : n.risk_level === 'MEDIUM' ? 'warn' : 'safe'}`}>
                        {n.risk_level} RISK
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Source: {n.source}
                    </p>
                    <p className="rec-reason" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>"{n.headline}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Panel (Full Width) */}
            <div className="glass-panel full-width stagger-4">
              <div className="section-header">
                <div className="icon-wrapper success">
                  <ShieldCheck size={20} />
                </div>
                <h3>Alternative Sourcing Strategies</h3>
              </div>
              {data.recommendations.length > 0 ? (
                <div className="metrics-grid">
                  {data.recommendations.map(rec => {
                    const stats = findSupplierStats(rec.supplier_id);
                    return (
                      <div key={rec.supplier_id} className="rec-card">
                        <div className="rec-header">
                          <span className="rec-title">{rec.name}</span>
                          <span className="rec-score-badge">
                            <Sparkles size={12} /> {Math.round(rec.confidence_score * 100)}% Fit
                          </span>
                        </div>
                        
                        {stats && (
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '8px', 
                            background: 'rgba(0,0,0,0.15)',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '12px',
                            fontSize: '0.8rem',
                            fontFamily: 'var(--font-mono)'
                          }}>
                            <div>Location: <span style={{ color: 'var(--primary)' }}>{stats.location}</span></div>
                            <div>Cost Index: <span style={{ color: 'var(--secondary)' }}>{stats.cost_index}x</span></div>
                            <div>Fill Rate: <span style={{ color: 'var(--success)' }}>{(stats.fill_rate * 100).toFixed(0)}%</span></div>
                            <div>OTD Rate: <span style={{ color: 'var(--success)' }}>{(stats.on_time_delivery_rate * 100).toFixed(0)}%</span></div>
                          </div>
                        )}

                        <p className="rec-reason">
                          {rec.reason}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', padding: '12px' }}>
                  <CheckCircle size={18} color="var(--success)" />
                  <span>Supply lines are fully optimized. Alternative suppliers are not required.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer explaining data ingestion and heuristics */}
      <footer className="glass-panel stagger-4" style={{ 
        marginTop: '24px', 
        textAlign: 'center', 
        padding: '20px 24px',
        border: '1px solid var(--glass-border)'
      }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          This agent ingests real-time web intelligence signals by querying live weather alerts and news indices related to primary supply chain components. Simultaneously, it scrapes logistics statuses and congestion reports directly from simulated port endpoints. Ingested data is then normalized and analyzed using automated risk heuristic scoring and deep semantic evaluation models to identify threats and rank alternative suppliers.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
