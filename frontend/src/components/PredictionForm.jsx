import { useState } from 'react';
import { Target, Rocket, Dices, Sparkles, AlertCircle, MessageCircle, Binary } from 'lucide-react';
import './PredictionForm.css';

function PredictionForm({ onPredict, isLoading }) {
    const [mode, setMode] = useState('features'); // 'features' or 'prompt'
    const [features, setFeatures] = useState('0.5, 1.2, -3.4');
    const [prompt, setPrompt] = useState('I love using InferenceHub!');
    const [modelName, setModelName] = useState('sentiment-local-v1');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            let payload = { modelName };

            if (mode === 'features') {
                const featureArray = features.split(',').map(f => parseFloat(f.trim()));
                if (featureArray.some(isNaN)) {
                    throw new Error('All features must be valid numbers');
                }
                payload.features = featureArray;
            } else {
                if (!prompt.trim()) throw new Error('Prompt cannot be empty');
                payload.prompt = prompt;
            }

            // Pass the correct arguments to onPredict
            const prediction = await onPredict(
                payload.features || [], // features
                payload.modelName,      // model_name
                payload.prompt          // prompt
            );

            setResult(prediction.result);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleQuickTest = () => {
        if (mode === 'features') {
            const randomFeatures = Array(3).fill(0).map(() => (Math.random() * 10 - 5).toFixed(2));
            setFeatures(randomFeatures.join(', '));
        } else {
            const prompts = [
                "This product is amazing!",
                "I am very disappointed with the service.",
                "It was okay, nothing special.",
                "Absolutely terrible experience.",
                "Best purchase I've ever made!"
            ];
            setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
        }
    };

    return (
        <div className="card prediction-form-card">
            <div className="form-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={24} color="var(--primary)" />
                    <h3>Test Prediction</h3>
                </div>
                <p className="form-subtitle">Send a request to the inference service</p>
            </div>

            {/* Mode Switcher */}
            <div className="mode-switcher">
                <button
                    className={`mode-btn ${mode === 'features' ? 'active' : ''}`}
                    onClick={() => {
                        setMode('features');
                        setModelName('random-forest-v1');
                    }}
                    type="button"
                >
                    <Binary size={16} />
                    Numeric Features
                </button>
                <button
                    className={`mode-btn ${mode === 'prompt' ? 'active' : ''}`}
                    onClick={() => {
                        setMode('prompt');
                        setModelName('sentiment-local-v1');
                    }}
                    type="button"
                >
                    <MessageCircle size={16} />
                    Sentiment Analysis
                </button>
            </div>

            <form onSubmit={handleSubmit} className="prediction-form mt-md">
                {mode === 'features' ? (
                    <div className="input-group">
                        <label htmlFor="features">
                            Feature Vector
                            <span className="label-hint">(comma-separated numbers)</span>
                        </label>
                        <input
                            id="features"
                            type="text"
                            className="input"
                            value={features}
                            onChange={(e) => setFeatures(e.target.value)}
                            placeholder="e.g., 0.5, 1.2, -3.4"
                        />
                    </div>
                ) : (
                    <div className="input-group">
                        <label htmlFor="prompt">
                            Text Prompt
                            <span className="label-hint">(for Sentiment Analysis)</span>
                        </label>
                        <textarea
                            id="prompt"
                            className="input textarea"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter text to analyze..."
                            rows={3}
                        />
                    </div>
                )}

                <div className="input-group">
                    <label htmlFor="modelName">
                        Model Name
                        <span className="label-hint">(optional)</span>
                    </label>
                    <input
                        id="modelName"
                        type="text"
                        className="input"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        placeholder="e.g., gpt-4o-mini"
                    />
                </div>

                <div className="button-group">
                    <button
                        type="submit"
                        className="btn btn-primary btn-large"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-small"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Rocket size={18} />
                                Run Prediction
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleQuickTest}
                        disabled={isLoading}
                    >
                        <Dices size={18} />
                        Random Test
                    </button>
                </div>
            </form>

            {/* Result Display */}
            {result && !error && (
                <div className="result-display animate-scale-in">
                    <div className="result-header">
                        <Sparkles size={24} color="var(--primary)" />
                        <h4>Prediction Result</h4>
                    </div>

                    <div className="result-grid">
                        <div className="result-item">
                            <span className="result-label">Class ID</span>
                            <span className="result-value result-class">
                                {result.class_id}
                                <span className="class-label">
                                    {mode === 'prompt' ?
                                        (result.class_id === 1 ? ' (Positive)' : result.class_id === 0 ? ' (Negative)' : ' (Neutral)')
                                        : ''}
                                </span>
                            </span>
                        </div>

                        <div className="result-item">
                            <span className="result-label">Confidence</span>
                            <div className="confidence-container">
                                <span className="result-value">{(result.confidence * 100).toFixed(2)}%</span>
                                <div className="confidence-bar">
                                    <div
                                        className="confidence-fill"
                                        style={{ width: `${result.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="error-display animate-shake">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

export default PredictionForm;
