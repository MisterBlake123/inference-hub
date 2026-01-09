import { Server, Code2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import './ApiDocs.css';

function ApiDocs() {
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div id="docs" className="api-docs-section">
            <div className="docs-header">
                <Server size={32} color="var(--primary)" />
                <h2>API Documentation</h2>
            </div>

            <p className="docs-intro">
                InferenceHub exposes a RESTful Gateway that forwards requests to the internal gRPC inference service.
            </p>

            <div className="grid grid-2">
                {/* Predict Endpoint */}
                <div className="card docs-card">
                    <div className="endpoint-badge badge-post">POST</div>
                    <h3 className="endpoint-title">/predict</h3>
                    <p className="endpoint-desc">Run inference on a set of features.</p>

                    <div className="code-block-container">
                        <div className="code-header">
                            <span>Request Body (JSON)</span>
                        </div>
                        <div className="code-content">
                            <pre>{`{
  "features": [0.5, 1.2, -3.4],
  "model_name": "v1-mock"
}`}</pre>
                            <button
                                className="copy-btn"
                                onClick={() => handleCopy('{\n  "features": [0.5, 1.2, -3.4],\n  "model_name": "v1-mock"\n}', 'req-predict')}
                            >
                                {copiedId === 'req-predict' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="code-block-container mt-md">
                        <div className="code-header">
                            <span>Response (JSON)</span>
                        </div>
                        <div className="code-content">
                            <pre>{`{
  "class_id": 2,
  "confidence": 0.95,
  "error": ""
}`}</pre>
                        </div>
                    </div>
                </div>

                {/* Health Endpoint */}
                <div className="card docs-card">
                    <div className="endpoint-badge badge-get">GET</div>
                    <h3 className="endpoint-title">/health</h3>
                    <p className="endpoint-desc">Check the health status of the gateway and gRPC connection.</p>

                    <div className="code-block-container">
                        <div className="code-header">
                            <span>Response (JSON)</span>
                        </div>
                        <div className="code-content">
                            <pre>{`{
  "status": "Gateway is running",
  "grpc_target": "inference-service:50051"
}`}</pre>
                            <button
                                className="copy-btn"
                                onClick={() => handleCopy('{\n  "status": "Gateway is running",\n  "grpc_target": "inference-service:50051"\n}', 'res-health')}
                            >
                                {copiedId === 'res-health' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* gRPC Info */}
            <div className="grpc-info-card mt-xl card">
                <div className="grpc-header">
                    <Code2 size={24} color="var(--secondary)" />
                    <h3>Internal gRPC Definition</h3>
                </div>
                <p className="mb-md">The internal service uses the following Protobuf definition:</p>

                <div className="code-block-container">
                    <div className="code-header">
                        <span>inference.proto</span>
                    </div>
                    <div className="code-content">
                        <pre>{`syntax = "proto3";

package inference;

service ModelInference {
  rpc Predict (PredictRequest) returns (PredictResponse) {}
}

message PredictRequest {
  repeated float features = 1;
  string model_name = 2;
}

message PredictResponse {
  int32 class_id = 1;
  float confidence = 2;
  string error = 3;
}`}</pre>
                        <button
                            className="copy-btn"
                            onClick={() => handleCopy(`syntax = "proto3";...`, 'proto')}
                        >
                            {copiedId === 'proto' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApiDocs;
