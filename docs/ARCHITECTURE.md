# 🏗️ System Architecture

## 1. High-Level Design (HLD)

InferenceHub implements the **AI Gateway Pattern**. It separates the "heavy" lifting of Machine Learning (Python/PyTorch) from the "high concurrency" requirements of a Web API (Node.js). They communicate over **gRPC** for efficient low-latency binary transport.

```mermaid
graph LR
    Client([👤 Client / Frontend]) -->|JSON (HTTP)| Gateway[⚡ Node.js API Gateway]
    
    subgraph "Private Network"
        Gateway -->|Protobuf (gRPC)| Service[🧠 Python Inference Service]
    end
    
    Service -->|Prediction| Gateway
    Gateway -->|Response| Client
```

### Core Components
1.  **Node.js Gateway (Express)**:
    *   **Role**: The Doorman. Handles Auth, Validation, and Rate Limiting.
    *   **Protocol**: Translates external HTTP/JSON requests into internal gRPC calls.
    *   **Why**: Node.js has an asynchronous event loop, perfect for handling thousands of concurrent connections while waiting for the slower Python worker.

2.  **Python Inference Service**:
    *   **Role**: The Brain. Loads large ML models into memory.
    *   **Protocol**: gRPC Server.
    *   **Why**: Python is the lingua franca of AI/ML.

---

## 2. Low-Level Design (LLD)

### The API Contract (Protobuf)
The strict contract between the Gateway and Worker is defined in `inference.proto`. This prevents type errors that are common in JSON-based microservices.

```protobuf
syntax = "proto3";

// The Service Definition
service ModelInference {
  rpc Predict (PredictRequest) returns (PredictResponse) {}
}

// Strictly Typed Messages
message PredictRequest {
  repeated float features = 1; // Array of numbers
  string model_name = 2;       // Versioning
  string prompt = 3;           // NLP Text
}

message PredictResponse {
  float probability = 1;
  string label = 2;
  double latency_ms = 3;
}
```

---

## 3. Decision Log

| Decision | Alternative | Reason for Choice |
| :--- | :--- | :--- |
| **gRPC (Protobuf)** | REST (JSON) | **Performance**. Protobuf payloads are significantly smaller and faster to serialize/deserialize than JSON, which matters for high-throughput inference loops. |
| **Node.js Gateway** | Python (FastAPI) | **Concurrency**. While FastAPI is great, Node.js ecosystem (middleware, auth) allows us to build a more robust standard API layer that orchestrates multiple downstream Python services. |
| **Docker Compose** | Kubernetes | **Simplicity**. For a single-node demonstration, Docker Compose is sufficient. K8s introduces overhead unnecessary for a portfolio proof-of-concept. |

---

## 4. Key Patterns

### The "Sidecar" Proxy (Simplified)
While not a full Envoy sidecar, the Node.js Gateway acts as a smart proxy. It abstracts the complexity of the ML model. The frontend doesn't need to know if the model is PyTorch, TensorFlow, or a random forest script; it just POSTs JSON.

### Heavy-Light Split
*   **Light components (Node)** scale on I/O.
*   **Heavy components (Python)** scale on CPU/GPU.
*   Decoupling them allows us to scale the Python layer (e.g., 10 replicas) independently of the Node layer (e.g., 2 replicas).
