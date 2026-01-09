import { Activity, RotateCw, Monitor, Server, BrainCircuit, Zap, XCircle, Globe } from 'lucide-react';
import './ServiceHealth.css';

function ServiceHealth({ status, onRefresh, isProcessing }) {
    const isOnline = status.status === 'online';

    return (
        <div className="card service-health">
            <div className="health-header">
                <div className="health-title-group">
                    <Activity size={24} color="var(--primary)" />
                    <h3>System Pipeline Status</h3>
                    <div className={`status-indicator ${isOnline ? 'status-online' : 'status-offline'}`}></div>
                </div>
                <button onClick={onRefresh} className="btn btn-outline btn-sm">
                    <RotateCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Visual Pipeline */}
            <div className="pipeline-container">

                {/* Node 1: Client */}
                <div className="pipeline-node">
                    <div className={`node-icon-wrapper client ${isProcessing ? 'processing' : ''}`}>
                        <Monitor size={24} />
                    </div>
                    <span className="node-label">Client</span>
                    <span className="node-sublabel">React Frontend</span>
                </div>

                {/* Connection 1: REST */}
                <div className="pipeline-connection">
                    <span className="connection-label">REST/HTTP</span>
                    <div className={`connection-line ${isProcessing ? 'processing' : (isOnline ? 'animate-flow' : '')}`}>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                    <span className="connection-port">:3000</span>
                </div>

                {/* Node 2: Gateway */}
                <div className="pipeline-node">
                    <div className={`node-icon-wrapper gateway ${isProcessing ? 'processing' : (isOnline ? 'active' : 'error')}`}>
                        <Server size={24} />
                        <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
                    </div>
                    <span className="node-label">API Gateway</span>
                    <span className="node-sublabel">Node.js / Express</span>
                </div>

                {/* Connection 2: gRPC */}
                <div className="pipeline-connection">
                    <span className="connection-label">gRPC (Proto)</span>
                    <div className={`connection-line ${isProcessing ? 'processing' : (isOnline ? 'animate-flow-fast' : '')}`}>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                    <span className="connection-port">:50051</span>
                </div>

                {/* Node 3: AI Service */}
                <div className="pipeline-node">
                    <div className={`node-icon-wrapper ai ${isProcessing ? 'processing' : (isOnline ? 'active' : 'error')}`}>
                        <BrainCircuit size={24} />
                        <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
                    </div>
                    <span className="node-label">Inference Model</span>
                    <span className="node-sublabel">Python / OpenAI</span>
                </div>

            </div>

            {/* Network Details */}
            <div className="network-details">
                <div className="detail-item">
                    <Globe size={16} className="text-secondary" />
                    <span className="detail-key">Gateway Host:</span>
                    <code className="code-inline">localhost</code>
                </div>
                <div className="detail-item">
                    <Zap size={16} className="text-secondary" />
                    <span className="detail-key">Target:</span>
                    <code className="code-inline">{status.grpc_target || 'Connecting...'}</code>
                </div>
            </div>

            {status.error && (
                <div className="health-error">
                    <XCircle size={20} />
                    <span>{status.error}</span>
                </div>
            )}
        </div>
    );
}

export default ServiceHealth;
