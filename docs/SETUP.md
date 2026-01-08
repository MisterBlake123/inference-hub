# InferenceHub Setup Guide

This guide will walk you through setting up and running InferenceHub on your local machine.

## 📋 Prerequisites

### Required Software

1. **Docker Desktop**
   - Download: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Version: 20.10 or higher
   - Includes Docker Compose

2. **Git**
   - Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)
   - For cloning the repository

### System Requirements

- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 2GB for Docker images
- **CPU**: No GPU required (runs on CPU)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Kimosabey/inference-hub.git
cd inference-hub
```

### 2. Build and Start Services

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

**Expected Output:**
```
Creating network "inference-hub_mlops-network" with driver "bridge"
Building gateway...
Building inference-service...
Creating inference-hub_inference-service_1 ... done
Creating inference-hub_gateway_1            ... done
```

### 3. Verify Services are Running

```bash
# Check running containers
docker-compose ps
```

**Expected Output:**
```
Name                          State   Ports
inference-hub_gateway_1       Up      0.0.0.0:3000->3000/tcp
inference-hub_inference-service_1  Up  0.0.0.0:50051->50051/tcp
```

### 4. Test the API

**Using cURL:**
```bash
curl -X POST http://localhost:3000/predict \
     -H "Content-Type: application/json" \
     -d '{"features": [0.5, 1.2, -3.4], "model_name": "v1-mock"}'
```

**Expected Response:**
```json
{
  "class_id": 3,
  "confidence": 0.94,
  "error": ""
}
```

**Using PowerShell (Windows):**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/predict `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"features": [0.5, 1.2, -3.4], "model_name": "v1-mock"}'
```

## 🔧 Development Setup

If you want to run services locally without Docker:

### Gateway Service (Node.js)

```bash
# Navigate to gateway directory
cd gateway

# Install dependencies
npm install

# Start the server
npm start
```

**Environment Variables** (create `.env` file):
```env
PORT=3000
GRPC_SERVER_URL=localhost:50051
```

### Inference Service (Python)

```bash
# Navigate to model_service directory
cd model_service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Generate Protobuf code
python -m grpc_tools.protoc -I../proto --python_out=. --grpc_python_out=. ../proto/inference.proto

# Start the server
python server.py
```

**Environment Variables**:
```bash
# Windows PowerShell
$env:PORT="50051"

# macOS/Linux
export PORT=50051
```

## 📊 Monitoring and Logs

### View Live Logs

```bash
# All services
docker-compose logs -f

# Gateway only
docker-compose logs -f gateway

# Inference service only
docker-compose logs -f inference-service
```

### Expected Log Output

**Gateway:**
```
[Gateway] running on http://localhost:3000
[Gateway] Connected to gRPC service at inference-service:50051
```

**Inference Service:**
```
[Inference] Starting gRPC Server...
[Inference] 🚀 Server listening on port 50051
```

**On Request:**
```
[Gateway] Forwarding request to gRPC Service at inference-service:50051...
[Inference] 🧠 Received request for model: v1-mock
[Inference] 🔢 Features received: 3
[Inference] ✅ Processed in 0.5023s
```

## 🛑 Stopping Services

### Stop All Services

```bash
# Stop and remove containers
docker-compose down

# Stop, remove containers, and delete volumes
docker-compose down -v

# Stop, remove containers, and delete images
docker-compose down --rmi all
```

### Stop Individual Service

```bash
# Stop gateway
docker-compose stop gateway

# Restart gateway
docker-compose restart gateway
```

## 🔄 Rebuilding Services

After making code changes:

```bash
# Rebuild all services
docker-compose up --build

# Rebuild specific service
docker-compose up --build gateway
```

## 🧪 Testing

### Health Check Endpoint

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "Gateway is running",
  "grpc_target": "inference-service:50051"
}
```

### Sample Test Cases

**Test 1: Valid Request**
```bash
curl -X POST http://localhost:3000/predict \
     -H "Content-Type: application/json" \
     -d '{"features": [1.0, 2.0, 3.0], "model_name": "test-model"}'
```

**Test 2: Minimal Request (model_name optional)**
```bash
curl -X POST http://localhost:3000/predict \
     -H "Content-Type: application/json" \
     -d '{"features": [0.1, 0.2, 0.3]}'
```

**Test 3: Invalid Request (should return 400)**
```bash
curl -X POST http://localhost:3000/predict \
     -H "Content-Type: application/json" \
     -d '{"features": "invalid"}'
```

**Expected Error:**
```json
{
  "error": "Features must be an array of numbers"
}
```

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Error:**
```
ERROR: for gateway  Cannot start service gateway: driver failed programming external connectivity on endpoint inference-hub_gateway_1: Bind for 0.0.0.0:3000 failed: port is already allocated
```

**Solution:**
```bash
# Find process using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or change the port in docker-compose.yml
ports:
  - "3001:3000"  # Changed from 3000:3000
```

### Issue: gRPC Connection Failed

**Error:**
```
[Gateway] gRPC Error: 14 UNAVAILABLE: failed to connect to all addresses
```

**Solution:**
1. Check if inference service is running:
   ```bash
   docker-compose ps inference-service
   ```

2. Verify network connectivity:
   ```bash
   docker-compose exec gateway ping inference-service
   ```

3. Restart services:
   ```bash
   docker-compose restart
   ```

### Issue: Docker Build Fails

**Error:**
```
ERROR [internal] load metadata for docker.io/library/node:18
```

**Solution:**
1. Check Docker is running:
   ```bash
   docker version
   ```

2. Pull base images manually:
   ```bash
   docker pull node:18
   docker pull python:3.9-slim
   ```

3. Retry build:
   ```bash
   docker-compose build --no-cache
   ```

### Issue: Protobuf Generation Failed (Python)

**Error:**
```
ModuleNotFoundError: No module named 'inference_pb2'
```

**Solution:**
```bash
# Navigate to model_service
cd model_service

# Regenerate protobuf files
python -m grpc_tools.protoc -I../proto --python_out=. --grpc_python_out=. ../proto/inference.proto

# Verify files were generated
ls *.py
# Should show: server.py, inference_pb2.py, inference_pb2_grpc.py
```

## 🔍 Advanced Configuration

### Custom Environment Variables

Create `.env` file in the root directory:

```env
# Gateway Configuration
GATEWAY_PORT=3000
GRPC_SERVER_URL=inference-service:50051

# Inference Service Configuration
INFERENCE_PORT=50051
```

Update `docker-compose.yml`:
```yaml
gateway:
  environment:
    - PORT=${GATEWAY_PORT}
    - GRPC_SERVER_URL=${GRPC_SERVER_URL}
```

### Scaling Inference Service

```bash
# Run 3 instances of inference service
docker-compose up --scale inference-service=3

# Note: Load balancing between instances requires additional setup (e.g., NGINX)
```

## 📚 Next Steps

- ✅ **Explore Code**: Check `gateway/index.js` and `model_service/server.py`
- ✅ **Modify Protobuf**: Edit `proto/inference.proto` and rebuild
- ✅ **Add Features**: Implement authentication, logging, or error handling
- ✅ **Deploy to Cloud**: Use Kubernetes or AWS ECS

## 🆘 Getting Help

If you encounter issues not covered here:

1. **Check Logs**: `docker-compose logs -f`
2. **Verify Docker**: `docker version` and `docker-compose version`
3. **Review Architecture**: Read [ARCHITECTURE.md](ARCHITECTURE.md)
4. **GitHub Issues**: Open an issue with logs and error details
