import { Brain, LayoutDashboard, FileText, Github } from 'lucide-react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo-group">
                        <div className="logo-icon">
                            <Brain size={28} color="white" variant="stroke" />
                        </div>
                        <div>
                            <h2 className="logo-text">InferenceHub</h2>
                            <p className="logo-subtitle">ML Microservices Platform</p>
                        </div>
                    </div>

                    <nav className="nav">
                        <a href="#dashboard" className="nav-link active">
                            <LayoutDashboard size={18} />
                            Dashboard
                        </a>
                        <a href="#docs" className="nav-link">
                            <FileText size={18} />
                            API Docs
                        </a>
                        <a href="https://github.com/Kimosabey/inference-hub" target="_blank" rel="noopener noreferrer" className="nav-link">
                            <Github size={18} />
                            GitHub
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
