import { BarChart3, Inbox, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import './PredictionHistory.css';

function PredictionHistory({ predictions }) {
    if (predictions.length === 0) {
        return (
            <div className="card prediction-history-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <BarChart3 size={24} color="var(--primary)" />
                    <h3>Prediction History</h3>
                </div>
                <div className="empty-state">
                    <Inbox size={64} color="var(--text-tertiary)" strokeWidth={1.5} />
                    <p>No predictions yet</p>
                    <p className="empty-hint">Run your first prediction to see results here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card prediction-history-card">
            <div className="history-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={24} color="var(--primary)" />
                    <h3>Prediction History</h3>
                </div>
                <span className="history-count badge badge-info">
                    {predictions.length} {predictions.length === 1 ? 'request' : 'requests'}
                </span>
            </div>

            <div className="history-list">
                {predictions.map((prediction, index) => (
                    <div
                        key={prediction.id}
                        className="history-item animate-slide-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="history-item-header">
                            <span className="history-timestamp">{prediction.timestamp}</span>
                            <span className={`badge ${prediction.success ? 'badge-success' : 'badge-error'}`}>
                                {prediction.success ? (
                                    <>
                                        <CheckCircle2 size={14} />
                                        Success
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={14} />
                                        Failed
                                    </>
                                )}
                            </span>
                        </div>

                        <div className="history-item-body">
                            <div className="history-detail">
                                <span className="detail-label">Model:</span>
                                <code className="code-inline">{prediction.modelName}</code>
                            </div>

                            {prediction.prompt ? (
                                <div className="history-detail" style={{ alignItems: 'flex-start' }}>
                                    <span className="detail-label" style={{ marginTop: '2px' }}>Prompt:</span>
                                    <span className="text-secondary" style={{ fontSize: '0.8125rem', fontStyle: 'italic' }}>
                                        "{prediction.prompt.length > 50 ? prediction.prompt.substring(0, 50) + '...' : prediction.prompt}"
                                    </span>
                                </div>
                            ) : (
                                <div className="history-detail">
                                    <span className="detail-label">Features:</span>
                                    <code className="code-inline">[{prediction.features.join(', ')}]</code>
                                </div>
                            )}

                            {prediction.success && prediction.result && (
                                <div className="history-result">
                                    <div className="history-result-item">
                                        <span className="result-mini-label">Class</span>
                                        <span className="result-mini-value">{prediction.result.class_id}</span>
                                    </div>
                                    <div className="history-result-item">
                                        <span className="result-mini-label">Confidence</span>
                                        <span className="result-mini-value">
                                            {(prediction.result.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            )}

                            {!prediction.success && prediction.result?.error && (
                                <div className="history-error">
                                    <AlertCircle size={16} />
                                    <span>{prediction.result.error}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PredictionHistory;
