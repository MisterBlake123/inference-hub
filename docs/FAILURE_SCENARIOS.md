# 🛡️ Failure Scenarios & Resilience

> "AI Models are slow and fragile. The Gateway must be fast and strong."

This document details how the system handles the unique failure modes of ML inference.

## 1. Failure Matrix

| Component | Failure Mode | Impact | Recovery Strategy |
| :--- | :--- | :--- | :--- |
| **Python Service** | Model Crash (OOM) | **Critical**. 500 Errors. | **Docker Restart Policy**. The container auto-restarts. Gateway treats it as a temporary timeout. |
| **Python Service** | High Latency (Hang) | **Major**. Client hangs. | **Deadlines**. gRPC calls have a strict 5-second deadline. Gateway returns `504 Gateway Timeout` instantly if deadline exceeded. |
| **Gateway** | Invalid Input | **Minor**. 400 Error. | **Validation**. Schema validation occurs in Node.js *before* touching the gRPC channel, saving resources. |

---

## 2. Deep Dive: The gRPC Deadline Pattern

### The Problem
ML models can get stuck in infinite loops or take 60s+ during garbage collection. A standard HTTP request might hang forever.

### The Solution: Deadlines (Timeouts)
In `gateway/src/client.js`, we set a hard limit:
```javascript
client.predict(request, { deadline: Date.now() + 5000 }, (err, response) => {
  if (err.code === grpc.status.DEADLINE_EXCEEDED) {
     return res.status(504).json({ error: "Model took too long" });
  }
});
```
This ensures the Gateway remains responsive even if the backend is burning.

---

## 3. Resilience Testing

### Test 1: The "Heavy" Request
1.  Send a specific payload that triggers a 10-second sleep in the mock model.
    ```json
    { "prompt": "simulate-timeout" }
    ```
2.  **Expectation**: The Gateway should return HTTP 504 **exactly at 5 seconds**. It should **not** hang for 10 seconds.

### Test 2: Service Kill
1.  Stop the python service: `docker stop inference-service`.
2.  Send a request.
3.  **Expectation**: Immediate `503 Service Unavailable` (gRPC UNAVAILABLE). The Gateway doesn't crash.
