# 🚀 Getting Started with InferenceHub

> **Prerequisites**
> *   **Docker Desktop** (Required for gRPC networking)
> *   **Git**

## 1. Environment Setup

The project is container-native. No local Python/Node installation is required if using Docker.

**Backend (`.env`)**
Default values work out of the box.
```ini
GATEWAY_PORT=3000
GRPC_HOST=inference-service
GRPC_PORT=50051
```

---

## 2. Installation & Launch

### Step 1: Clone & Build
```bash
git clone https://github.com/Kimosabey/inference-hub.git
cd inference-hub

# Build and Start containerized services
docker-compose up --build -d
```

### Step 2: Verify Status
```bash
docker-compose ps
# You should see:
# - inference-gateway (Port 3000)
# - inference-service (Port 50051)
```

### Step 3: Access UI
Open **`http://localhost:5173`** (or whichever port Vite assigned, usually shown in logs if running locally, otherwise via Gateway check).
*Note: The current configuration exposes the API at 3000 and Frontend at 5173.*

---

## 3. Usage Guide

### Test with CURL (API)
Send a request to the Node.js Gateway, which forwards it to Python via gRPC.

```bash
# Test Numeric Prediction
curl -X POST http://localhost:3000/predict \
  -H "Content-Type: application/json" \
  -d '{ 
    "features": [0.8, 0.2, 0.5], 
    "model_name": "risk-v1" 
  }'

# Response
# { "label": "medium-risk", "probability": 0.65, "latency_ms": 12 }
```

### Test Health
```bash
curl http://localhost:3000/health
```

---

## 4. Running Tests

### Unit Tests
Currently, tests are run inside the containers.
```bash
# Test Python Logic
docker exec -it inference-service python -m pytest

# Test Node.js Gateway
docker exec -it inference-gateway npm test
```
