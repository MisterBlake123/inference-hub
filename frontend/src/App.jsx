import { useState, useEffect } from 'react';
import './App.css';
import ServiceHealth from './components/ServiceHealth';
import PredictionForm from './components/PredictionForm';
import PredictionHistory from './components/PredictionHistory';
import Header from './components/Header';
import ApiDocs from './components/ApiDocs';

const API_BASE_URL = 'http://localhost:3000';

function App() {
  const [serviceStatus, setServiceStatus] = useState({ status: 'checking', grpc_target: '' });
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check service health on mount
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setServiceStatus({ ...data, status: 'online' });
    } catch (error) {
      setServiceStatus({ status: 'offline', grpc_target: 'unavailable', error: error.message });
    }
  };

  const handlePredict = async (features, modelName, prompt) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: features,
          model_name: modelName,
          prompt: prompt
        }),
      });

      const data = await response.json();

      const prediction = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        features: features,
        modelName: modelName,
        prompt: prompt,
        result: data,
        success: !data.error,
      };

      setPredictions([prediction, ...predictions].slice(0, 10)); // Keep last 10
      return prediction;
    } catch (error) {
      const errorPrediction = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        features: features,
        modelName: modelName,
        prompt: prompt,
        result: { error: error.message },
        success: false,
      };
      setPredictions([errorPrediction, ...predictions].slice(0, 10));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />

      <div className="container">
        {/* Hero Section */}
        <div className="hero animate-fade-in">
          <h1 className="text-gradient mb-md">InferenceHub Dashboard</h1>
          <p className="hero-subtitle mb-xl">
            Modern microservices architecture for ML inference. Test your models with a beautiful,
            real-time interface powered by gRPC and REST APIs.
          </p>
        </div>

        {/* Service Health */}
        <div className="animate-scale-in">
          <ServiceHealth status={serviceStatus} onRefresh={checkHealth} isProcessing={isLoading} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-2 mt-lg">
          {/* Prediction Form */}
          <div className="animate-slide-in" style={{ animationDelay: '100ms' }}>
            <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
          </div>

          {/* Prediction History */}
          <div className="animate-slide-in" style={{ animationDelay: '200ms' }}>
            <PredictionHistory predictions={predictions} />
          </div>
        </div>

        {/* API Docs Section */}
        <ApiDocs />

        {/* Footer */}
        <footer className="footer mt-xl">
          <p>Built with passion using React, Vite, Node.js, Python & gRPC</p>
          <div className="tech-badges">
            <span className="badge badge-info">React</span>
            <span className="badge badge-info">Vite</span>
            <span className="badge badge-success">Node.js</span>
            <span className="badge badge-warning">Python</span>
            <span className="badge" style={{ background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', color: '#3730a3' }}>gRPC</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
