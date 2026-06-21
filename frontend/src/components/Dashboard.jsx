import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { triggerAnalysis, login } from '../services/api';

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    // Input fields
    const [location, setLocation] = useState('Seattle');
    const [keyword, setKeyword] = useState('Semiconductors');
    const [portId, setPortId] = useState('PORT-001');

    useEffect(() => {
        // Auto-login for demo purposes
        login('admin', 'admin123').catch(err => {
            console.error("Login failed", err);
            setError('Authentication failed. Ensure backend is running.');
        });
    }, []);

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await triggerAnalysis(location, keyword, portId);
            setData(result);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch analysis.');
        } finally {
            setLoading(false);
        }
    };

    const getScoreClass = (score) => {
        if (score < 0.3) return 'score-safe';
        if (score < 0.7) return 'score-warn';
        return 'score-danger';
    };

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1>Supply Chain Oracle</h1>
                <p>AI-Powered Disruption Prediction & Mitigation Agent</p>
            </header>

            <div className="glass-panel controls-bar">
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Location" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                />
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Keyword" 
                    value={keyword} 
                    onChange={e => setKeyword(e.target.value)} 
                />
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Port ID" 
                    value={portId} 
                    onChange={e => setPortId(e.target.value)} 
                />
                <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
                    {loading ? 'Analyzing Signals...' : 'Run Analysis'}
                </button>
            </div>

            {error && (
                <div className="glass-panel" style={{borderLeft: '4px solid var(--danger)'}}>
                    <p style={{color: 'var(--danger)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <AlertCircle size={20} /> {error}
                    </p>
                </div>
            )}

            {loading && <div className="loading-spinner"></div>}

            {data && !loading && (
                <div className="metrics-grid">
                    {/* Disruption Score Panel */}
                    <div className="glass-panel score-indicator">
                        <div className={`score-circle ${getScoreClass(data.prediction.score)}`}>
                            {Math.round(data.prediction.score * 100)}
                        </div>
                        <h3>Disruption Risk</h3>
                        <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>
                            {data.prediction.summary}
                        </p>
                    </div>

                    {/* Risk Factors Panel */}
                    <div className="glass-panel">
                        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <AlertTriangle size={20} color="var(--warning)" /> Risk Factors
                        </h3>
                        <ul className="factor-list">
                            {data.prediction.risk_factors.map((factor, idx) => (
                                <li key={idx} className="factor-item">
                                    <span style={{color: 'var(--danger)'}}>•</span> {factor}
                                </li>
                            ))}
                            {data.prediction.risk_factors.length === 0 && (
                                <li className="factor-item">No significant risks detected.</li>
                            )}
                        </ul>
                    </div>

                    {/* AI Recommendations Panel */}
                    <div className="glass-panel" style={{gridColumn: '1 / -1'}}>
                        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <ShieldCheck size={20} color="var(--success)" /> Recommended Alternate Suppliers
                        </h3>
                        {data.recommendations.length > 0 ? (
                            <div className="metrics-grid">
                                {data.recommendations.map(rec => (
                                    <div key={rec.supplier_id} className="rec-card">
                                        <div className="rec-header">
                                            <span className="rec-title">{rec.name}</span>
                                            <span className="rec-score">{Math.round(rec.confidence_score * 100)}% Match</span>
                                        </div>
                                        <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0}}>
                                            {rec.reason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{color: 'var(--text-secondary)'}}>No alternates needed at current risk levels.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
