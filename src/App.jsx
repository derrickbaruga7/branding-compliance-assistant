import React, { useState } from 'react'
import { Palette, FileText, CheckCircle, AlertTriangle, Upload, Settings } from 'lucide-react'
import BrandingUploader from './components/BrandingUploader'
import ComplianceChecker from './components/ComplianceChecker'
import IllustrationCanvas from './components/IllustrationCanvas'
import BrandingGuidelines from './components/BrandingGuidelines'

function App() {
  const [currentStep, setCurrentStep] = useState('upload') // upload, guidelines, canvas, compliance
  const [brandingData, setBrandingData] = useState(null)
  const [complianceResults, setComplianceResults] = useState(null)

  const handleBrandingUploaded = (data) => {
    setBrandingData(data)
    setCurrentStep('guidelines')
  }

  const handleComplianceCheck = (results) => {
    setComplianceResults(results)
    setCurrentStep('compliance')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return <BrandingUploader onUpload={handleBrandingUploaded} />
      case 'guidelines':
        return (
          <BrandingGuidelines 
            brandingData={brandingData} 
            onContinue={() => setCurrentStep('canvas')}
            onBack={() => setCurrentStep('upload')}
          />
        )
      case 'canvas':
        return (
          <IllustrationCanvas 
            brandingData={brandingData}
            onComplianceCheck={handleComplianceCheck}
            onBack={() => setCurrentStep('guidelines')}
          />
        )
      case 'compliance':
        return (
          <ComplianceChecker 
            results={complianceResults}
            brandingData={brandingData}
            onBack={() => setCurrentStep('canvas')}
            onNewProject={() => {
              setCurrentStep('upload')
              setBrandingData(null)
              setComplianceResults(null)
            }}
          />
        )
      default:
        return <BrandingUploader onUpload={handleBrandingUploaded} />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <Palette size={32} className="logo-icon" />
            <h1>Branding Compliance Assistant</h1>
          </div>
          <div className="step-indicator">
            <div className={`step ${currentStep === 'upload' ? 'active' : ''}`}>
              <Upload size={16} />
              <span>Upload Guidelines</span>
            </div>
            <div className={`step ${currentStep === 'guidelines' ? 'active' : ''}`}>
              <FileText size={16} />
              <span>Review Guidelines</span>
            </div>
            <div className={`step ${currentStep === 'canvas' ? 'active' : ''}`}>
              <Settings size={16} />
              <span>Create Design</span>
            </div>
            <div className={`step ${currentStep === 'compliance' ? 'active' : ''}`}>
              <CheckCircle size={16} />
              <span>Compliance Check</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {renderStep()}
      </main>

      <footer className="app-footer">
        <p>Real-time branding compliance for designers and illustrators</p>
      </footer>
    </div>
  )
}

export default App