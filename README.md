# InferenceHub

![Thumbnail](docs/assets/thumbnail.png)

## Decoupled AI Inference Architecture

<div align="center">

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Tech Stack**

![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.9-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Message](https://img.shields.io/badge/Protocol-gRPC_Protobuf-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Docker](https://img.shields.io/badge/DevOps-Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Patterns**

![Microservices](https://img.shields.io/badge/Pattern-Microservices-FF6B6B?style=flat-square)
![Decoupling](https://img.shields.io/badge/Pattern-Decoupled_Inference-4ECDC4?style=flat-square)
![Gateway](https://img.shields.io/badge/Pattern-API_Gateway-95E1D3?style=flat-square)

</div>

---

## 🚀 Quick Start

### 1. Prerequisites
- **Docker Desktop**
- **Git**

### 2. Installation
```bash
git clone https://github.com/Kimosabey/inference-hub.git
cd inference-hub
```

### 3. Run Services
```bash
docker-compose up --build -d
```

### 4. Verify
```bash
docker-compose ps
# Ensure Gateway (3000) and Inference Service (50051) are UP
```

---

## 📸 Screenshots

### Application UI
![Application UI](docs/assets/ui_preview.png)
*React frontend interacting with the decoupled inference engine*

### System Architecture
![Architecture Overview](docs/assets/architecture.png)
*gRPC-based communication between Gateway and Worker*

---

## ✨ Key Features

### ⚡ High-Performance Communication
- **gRPC Protocol**: Uses Protocol Buffers for 10x faster communication compared to REST.
- **Strict Typing**: `.proto` contracts ensure type safety between Node.js gateway and Python worker.

### 🛡️ Resilient Design
- **Decoupled Architecture**: Scaling the heavy inference worker doesn't affect the lightweight API gateway.
- **Fault Tolerance**: Gateway handles worker timeouts gracefully without crashing.

### 🧠 Hybrid Inference Engine
- **Text Analysis**: Instant Rule-Based Sentiment Analysis.
- **Numeric Prediction**: Simulated "heavy" model (Random Forest) with 500ms latency to demonstrate non-blocking I/O.

---

## 🏗️ Architecture

### System Components

| Component | Technology | Port | Responsibility |
| :--- | :--- | :--- | :--- |
| **Gateway** | Node.js + Express | **3000** | Auth, Validation, gRPC Client |
| **Worker** | Python | **50051** | Heavy Compute / Inference |
| **Protocol** | Protobuf | - | Binary Data Serialization |

### Protocol Definition (`inference.proto`)

```protobuf
service ModelInference {
  rpc Predict (PredictRequest) returns (PredictResponse) {}
}

message PredictRequest {
  repeated float features = 1;
  string model_name = 2;
  string prompt = 3; 
}
```

---

## 🔧 Tech Stack

| Component | Technology | Service |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Dashboard UI |
| **Gateway** | Node.js | API Entry Point |
| **Inference** | Python 3.9 | ML Runtime |
| **Transport** | gRPC / Protobuf | Inter-service comms |
| **Ops** | Docker Compose | Orchestration |

---

## 📡 API Usage

### Predict Endpoint
**POST** `http://localhost:3000/predict`

```bash
curl -X POST http://localhost:3000/predict \
     -H "Content-Type: application/json" \
     -d '{ "features": [0.5, 1.2], "model_name": "v1-mock" }'
```

### Health Check
**GET** `http://localhost:3000/health`

```bash
curl http://localhost:3000/health
# Returns: { "status": "Gateway is running", "grpc_target": "inference-service:50051" }
```

---

## 📚 Documentation

- [**Architecture Guide**](docs/ARCHITECTURE.md) - Deep dive into gRPC vs REST.
- [**Setup Guide**](docs/SETUP.md) - Troubleshooting and advanced config.

---

## 🚀 Future Enhancements

- [ ] Add JWT Authentication middleware to Gateway.
- [ ] Replace mock model with real PyTorch/TensorFlow model.
- [ ] Implement RabbitMQ for asynchronous "fire-and-forget" inference.
- [ ] Deploy to Kubernetes with HPA (Horizontal Pod Autoscaler).

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 👤 Author

**Harshan Aiyappa**  
Senior Full-Stack Engineer  
📧 [GitHub](https://github.com/Kimosabey)

---

**Built with**: Node.js • Python • gRPC • Docker
