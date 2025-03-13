import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import './App.css';
import { 
  FaUpload, 
  FaBrain, 
  FaChartLine, 
  FaRegLightbulb,
  FaMicroscope, 
  FaAngleDown,
  FaExclamationTriangle
} from 'react-icons/fa';

// Lazy-loaded components
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));

// Custom hook for animations
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

function App() {
  // State
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Animation refs
  const [headerRef, headerVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [featureRef, featureVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const [uploadRef, uploadVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  // File upload handling
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload an MRI image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setTimeout(async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'https://alzheimer-cnn-api.onrender.com';
          const response = await fetch(`${apiUrl}/predict`, {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
          }
          
          const data = await response.json();
          setResult(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error:', error);
          setError('Failed to analyze the image. Please try again.');
          setIsLoading(false);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to analyze the image. Please try again.');
      setIsLoading(false);
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-brand scttl">
          <FaBrain className="brand-icon" />
          <span>AlzheimerCNN</span>
        </div>
        <ul className="nav-links">
          <li className={activeSection === 'home' ? 'active' : ''}>
            <button onClick={() => scrollToSection('home')}>Home</button>
          </li>
          <li className={activeSection === 'about' ? 'active' : ''}>
            <button onClick={() => scrollToSection('about')}>About</button>
          </li>
          <li className={activeSection === 'system' ? 'active' : ''}>
            <button onClick={() => scrollToSection('system')}>System Design</button>
          </li>
          <li className={activeSection === 'upload' ? 'active' : ''}>
            <button onClick={() => scrollToSection('upload')}>Analyze</button>
          </li>
        </ul>
      </nav>

      {/* Header Section */}
      <header id="home" ref={headerRef} className={`hero-section ${headerVisible ? 'fade-in' : ''}`}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Alzheimer's</span> <span class="scttl">Detection</span>
          </h1>
          <p className="hero-subtitle">
            Empowering early diagnosis through advanced MRI analysis and deep learning
          </p>
          <div className="hero-actions">
            <button 
              className="btn-primary" 
              onClick={() => scrollToSection('upload')}
            >
              Try It Now
            </button>
            <button 
              className="btn-secondary"
              onClick={() => setShowLearnMore(!showLearnMore)}
            >
              Learn More <FaAngleDown className={`arrow-icon ${showLearnMore ? 'rotated' : ''}`} />
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="neuron-animation"></div>
        </div>
      </header>

      {/* Learn More Content (collapsible) */}
      {showLearnMore && (
        <Suspense fallback={<div className="loading-container"><div className="loader"></div></div>}>
          <ProjectDetails />
        </Suspense>
      )}

      {/* Features Section */}
      <section 
        id="about"
        ref={featureRef} 
        className={`features-section ${featureVisible ? 'fade-in' : ''}`}
      >
        <h2 className="section-title scttl">About Alzheimer's Disease</h2>
        <p className="section-description">
          Alzheimer's is a progressive neurodegenerative disorder affecting memory, thinking, and behavior.
          Early detection significantly improves management and care planning, providing patients and families
          valuable time to prepare and make informed decisions.
        </p>
        
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaBrain className="feature-icon" />
            </div>
            <h3 class="scttl">Advanced Analysis</h3>
            <p>Utilizes convolutional neural networks for classification of Alzheimer's stages from MRI scans with a focus on achieving high accuracy across all stages.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaRegLightbulb className="feature-icon" />
            </div>
            <h3 class="scttl">Early Detection</h3>
            <p>Identifies subtle changes in brain structure indicative of early-stage Alzheimer's that might be missed in routine examinations</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaChartLine className="feature-icon" />
            </div>
            <h3 class="scttl">Comprehensive Insights</h3>
            <p>Provides detailed analysis with confidence scores for different stages of Alzheimer's progression</p>
          </div>
        </div>
        
        <div className="brain-stages">
          <h3 className="stages-title scttl">Understanding The Progression</h3>
          <div className="stages-container scttl">
            <div className="stage-item">
              <div className="stage-circle non-demented"></div>
              <p>Non-Demented</p>
            </div>
            <div className="stage-connector"></div>
            <div className="stage-item">
              <div className="stage-circle very-mild "></div>
              <p>Very Mild</p>
            </div>
            <div className="stage-connector"></div>
            <div className="stage-item">
              <div className="stage-circle mild"></div>
              <p>Mild</p>
            </div>
            <div className="stage-connector"></div>
            <div className="stage-item">
              <div className="stage-circle moderate"></div>
              <p>Moderate</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Design Section */}
      <section id="system" className="system-section">
        <h2 className="section-title scttl">System Design & Architecture</h2>
        <p className="section-description">
          Our Alzheimer's detection system leverages a sophisticated architecture designed for accuracy and reliability.
          The modular approach ensures seamless integration of data preparation, feature extraction, and prediction.
        </p>
        
        <div className="system-workflow scttl">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Data Preparation</h4>
              <p>MRI images undergo preprocessing including normalization, noise reduction, and standardization</p>
            </div>
          </div>
          
          <div className="workflow-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Feature Extraction</h4>
              <p>Convolutional layers identify critical patterns and biomarkers in brain structure</p>
            </div>
          </div>
          
          <div className="workflow-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>CNN Processing</h4>
              <p>Deep learning model analyzes extracted features to classify the image</p>
            </div>
          </div>
          
          <div className="workflow-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Classification</h4>
              <p>Final classification with confidence scores for each Alzheimer's stage</p>
            </div>
          </div>
        </div>
        
        <div className="model-details scttl">
          <h3>CNN Model Architecture</h3>
          <div className="model-layers">
            <div className="layer input-layer">
              <span>Input Layer</span>
              <div className="layer-shape">224×224×3</div>
            </div>
            <div className="layer conv-layer">
              <span>Conv2D</span>
              <div className="layer-shape">32 filters</div>
            </div>
            <div className="layer pool-layer">
              <span>MaxPooling</span>
            </div>
            <div className="layer conv-layer">
              <span>Conv2D</span>
              <div className="layer-shape">64 filters</div>
            </div>
            <div className="layer pool-layer">
              <span>MaxPooling</span>
            </div>
            <div className="layer fc-layer">
              <span>Dense</span>
              <div className="layer-shape">128 units</div>
            </div>
            <div className="layer output-layer">
              <span>Output</span>
              <div className="layer-shape">4 classes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section 
        id="upload" 
        ref={uploadRef}
        className={`upload-section ${uploadVisible ? 'fade-in' : ''}`}
      >
        <h2 className="section-title scttl">Analyze MRI Scan</h2>
        <p className="section-description">
          Upload an MRI brain scan image for analysis. Our AI model will classify the image and provide
          detailed insights about potential Alzheimer's indicators.
        </p>
        
        <div className="upload-container">
          <div className="upload-area">
            <form onSubmit={handleSubmit}>
              <div className="file-drop-area" onClick={() => document.getElementById('file-input').click()}>
                {filePreview ? (
                  <div className="image-preview">
                    <img src={filePreview} alt="MRI Preview" />
                  </div>
                ) : (
                  <div className="upload-placeholder scttl">
                    <FaUpload className="upload-icon" />
                    <p>Click or drag to upload MRI image</p>
                    <span className="file-info">Supports: JPG, PNG, DICOM</span>
                  </div>
                )}
                <input
                  type="file"
                  id="file-input"
                  className="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              {file && (
                <div className="file-details">
                  <span>{file.name}</span>
                  <button 
                    type="button" 
                    className="btn-text" 
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  <FaExclamationTriangle /> {error}
                </div>
              )}
              
              <div className="action-buttons">
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={!file || isLoading}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Image'}
                </button>
                {!file && (
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    disabled={isLoading}
                  >
                    Try Demo
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className={`results-area ${result ? 'has-results' : ''}`}>
            {isLoading ? (
              <div className="loading-container scttl">
                <div className="loader"></div>
                <p>Analyzing MRI scan...</p>
              </div>
            ) : result ? (
              <div className="results-container scttl">
                <h3 className="results-title">Analysis Results</h3>
                <div className="result-card">
                  <div className="result-header">
                    <h4>Classification</h4>
                    <div className={`classification-badge ${result.class.toLowerCase().replace(/\s+/g, '-')}`}>
                      {result.class}
                    </div>
                  </div>
                  
                  <div className="confidence-meter">
                    <span className="confidence-label">Confidence: {result.confidence}%</span>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill" 
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            ) : (
              <div className="no-results">
                <FaMicroscope className="result-placeholder-icon" />
                <p>Upload an MRI scan to see the analysis results</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-logo scttl">
            <FaBrain className="footer-logo-icon" />
            <span>AlzheimerCNN</span>
          </div>
          <p className="footer-text">
            Alzheimer's Detection using Deep Learning and Neural Networks
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;