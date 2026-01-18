# 🎤 Interview Cheat Sheet: InferenceHub

## 1. The Elevator Pitch (2 Minutes)

"InferenceHub is a decoupled AI Gateway that bridges the gap between Web APIs and Machine Learning.

Instead of monolithic apps where the API and Model fight for CPU, I separated them:
1.  **Node.js Gateway**: Handles high-concurrency IO (Auth, Validation).
2.  **Python Worker**: Handles heavy CPU/GPU Compute.
3.  **gRPC**: Connects them with low-latency binary protocols.

This effectively allows me to scale the 'Brain' (Python) independently of the 'Door' (Node), which is critical for production ML systems."

---

## 2. "Explain Like I'm 5" (The Restaurant)

"Think of a Restaurant.
*   **The Waiter (Node.js)**: Runs around fast, taking orders. They don't cook.
*   **The Chef (Python)**: Stays in the back, cooking complex meals. They are slow but skilled.
*   **The Ticket System (gRPC)**: The concise code they use to communicate ('Burger, Med-Rare'). It's much faster than writing full sentences.
*   **The Result**: The Waiter never gets stuck cooking. If the Chef is slow, the Waiter can still talk to customers."

---

## 3. Tough Technical Questions

### Q: Why gRPC over REST?
**A:** "Three reasons:
1.  **Performance**: Protobuf is binary and smaller than JSON. For high-frequency inference (e.g., 1000 req/sec), parsing JSON burns CPU.
2.  **Strict Contracts**: With `.proto` files, the Node team and Python team have a guaranteed interface. No more 'string vs int' bugs.
3.  **Code Gen**: I generate the SDKs automatically. I don't write manual HTTP clients."

### Q: How do you handle Model Versioning?
**A:** "The `PredictRequest` message includes a `model_name` and `version` field. The Python worker can route the request to `ResNet-v1` or `ResNet-v2` dynamically based on this field, allowing for A/B testing or Canary deployments without changing the API signature."

### Q: Why not just use FastAPI for everything?
**A:** "FastAPI is excellent, but in a large enterprise, the 'Gateway' often needs to integrate with legacy Auth, Rate Limiters, and Logging infrastructure that might be standardized on Node/Go. This pattern demonstrates polyglot interoperability. It proves I can make different ecosystems talk to each other efficienty."
