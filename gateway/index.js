const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const GRPC_SERVER_URL = process.env.GRPC_SERVER_URL || 'localhost:50051';

// Load Protobuf
const PROTO_PATH = path.join(__dirname, 'proto/inference.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const inferenceProto = grpc.loadPackageDefinition(packageDefinition).inference;

// Create gRPC Client
const client = new inferenceProto.ModelInference(
    GRPC_SERVER_URL,
    grpc.credentials.createInsecure()
);

// REST Endpoint
app.post('/predict', (req, res) => {
    const { features, model_name } = req.body;

    if (!features || !Array.isArray(features)) {
        return res.status(400).json({ error: 'Features must be an array of numbers' });
    }

    const payload = {
        features: features,
        model_name: model_name || 'default-model'
    };

    console.log(`[Gateway] Forwarding request to gRPC Service at ${GRPC_SERVER_URL}...`);

    client.Predict(payload, (err, response) => {
        if (err) {
            console.error('[Gateway] gRPC Error:', err);
            return res.status(500).json({ error: 'Internal gRPC error', details: err.message });
        }
        res.json(response);
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'Gateway is running', grpc_target: GRPC_SERVER_URL });
});

app.listen(PORT, () => {
    console.log(`[Gateway] running on http://localhost:${PORT}`);
    console.log(`[Gateway] Connected to gRPC service at ${GRPC_SERVER_URL}`);
});
