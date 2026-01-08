# InferenceHub (The MLOps Bridge)

A microservices-based architecture demonstrating decoupled AI inference using **gRPC**.
This project simulates a production-grade MLOps system where the API Gateway is separated from the heavy Model Inference Service.

## 🏗 Architecture

1.  **Service A (Gateway)**: Node.js + Express (Handles HTTP requests, Validation).
2.  **Service B (Inference)**: Python + gRPC (Simulates heavy AI processing).
3.  **Communication**: gRPC (Protobufs) - High-performance binary protocol.

## 🚀 Key Features

-   **Decoupled Architecture**: Prevents model crashes from taking down the API.
-   **gRPC Communication**: Faster than REST, using strict types via Protobuf.
-   **Mock Inference Engine**: Simulates 500ms latency and random predictions on CPU (No GPU required).
-   **Docker Orchestration**: One command to bring up the entire stack.

## 🛠 Tech Stack

-   **Gateway**: Node.js, Express, @grpc/grpc-js
-   **Model Service**: Python, grpcio, NumPy
-   **DevOps**: Docker, Docker Compose

## 🏃‍♂️ How to Run

### Prerequisites
-   Docker & Docker Compose installed.

### Steps
1.  **Build and Start**:
    ```bash
    docker-compose up --build
    ```

2.  **Test the API**:
    Only the Gateway runs on HTTP (Port 3000). The Inference Service is hidden behind gRPC.

    __Request:__
    ```bash
    curl -X POST http://localhost:3000/predict \
         -H "Content-Type: application/json" \
         -d '{"features": [0.5, 1.2, -3.4], "model_name": "v1-mock"}'
    ```

    __Response:__
    ```json
    {
        "class_id": 3,
        "confidence": 0.94,
        "error": ""
    }
    ```

3.  **Check Logs**:
    You will see the Gateway forwarding the request and the Python Service processing it simulating a delay.

## 📂 Project Structure

```
inference-hub/
├── gateway/            # Node.js Express App
├── model_service/      # Python gRPC App
├── proto/              # Shared Protobuf Definitions
└── docker-compose.yml  # Orchestration
```
