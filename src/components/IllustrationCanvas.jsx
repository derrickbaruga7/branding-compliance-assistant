import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Download, Upload, Palette, Type, Ruler, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { checkCompliance } from '../services/complianceChecker'

const IllustrationCanvas = ({ brandingData, onComplianceCheck, onBack }) => {
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [complianceStatus, setComplianceStatus] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [designElements, setDesignElements] = useState([])

  useEffect(() => {
    // Initialize canvas
    const canvasElement = canvasRef.current
    if (canvasElement) {
      // Simple canvas setup - in a real app you'd use Fabric.js or similar
      const ctx = canvasElement.getContext('2d')
      canvasElement.width = 800
      canvasElement.height = 600
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height)
      setCanvas(canvasElement)
    }
  }, [])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvasElement = canvasRef.current
          const ctx = canvasElement.getContext('2d')
          
          // Clear canvas
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
          
          // Draw image
          ctx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height)
          setCurrentImage(img)
          
          // Check compliance
          checkDesignCompliance()
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const checkDesignCompliance = async () => {
    if (!canvas || !brandingData) return

    setIsChecking(true)
    setComplianceStatus(null)

    try {
      const results = await checkCompliance(canvas, brandingData, currentImage)
      setComplianceStatus(results)
    } catch (error) {
      console.error('Compliance check failed:', error)
      setComplianceStatus({
        overall: 'error',
        message: 'Failed to check compliance'
      })
    } finally {
      setIsChecking(false)
    }
  }

  const handleContinue = () => {
    if (complianceStatus) {
      onComplianceCheck(complianceStatus)
    }
  }

  const renderComplianceStatus = () => {
    if (isChecking) {
      return (
        <div className="compliance-status checking">
          <Loader2 size={20} className="spinner" />
          <span>Checking compliance...</span>
        </div>
      )
    }

    if (!complianceStatus) return null

    const isCompliant = complianceStatus.overall === 'compliant'
    const hasWarnings = complianceStatus.overall === 'warning'

    return (
      <div className={`compliance-status ${complianceStatus.overall}`}>
        <div className="status-header">
          {isCompliant ? (
            <CheckCircle size={20} className="status-icon" />
          ) : hasWarnings ? (
            <AlertTriangle size={20} className="status-icon" />
          ) : (
            <AlertTriangle size={20} className="status-icon error" />
          )}
          <span className="status-text">
            {isCompliant ? 'Design is compliant' : 
             hasWarnings ? 'Design has warnings' : 'Design has compliance issues'}
          </span>
        </div>

        {complianceStatus.issues && complianceStatus.issues.length > 0 && (
          <div className="compliance-issues">
            <h4>Issues Found:</h4>
            <ul>
              {complianceStatus.issues.map((issue, index) => (
                <li key={index} className={`issue ${issue.severity}`}>
                  <span className="issue-icon">
                    {issue.severity === 'error' ? <AlertTriangle size={14} /> : <AlertTriangle size={14} />}
                  </span>
                  <span className="issue-text">{issue.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {complianceStatus.suggestions && complianceStatus.suggestions.length > 0 && (
          <div className="compliance-suggestions">
            <h4>Suggestions:</h4>
            <ul>
              {complianceStatus.suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion">
                  <CheckCircle size={14} className="suggestion-icon" />
                  <span className="suggestion-text">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="canvas-container">
      <div className="canvas-header">
        <h2>Design Canvas</h2>
        <p>Upload your design or create one to check branding compliance</p>
      </div>

      <div className="canvas-layout">
        <div className="canvas-section">
          <div className="canvas-toolbar">
            <button 
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              Upload Design
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="btn-secondary"
              onClick={checkDesignCompliance}
              disabled={!currentImage}
            >
              <CheckCircle size={16} />
              Check Compliance
            </button>
          </div>

          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              className="design-canvas"
              style={{ border: '2px dashed #ddd', borderRadius: '8px' }}
            />
            {!currentImage && (
              <div className="canvas-placeholder">
                <Upload size={48} />
                <p>Upload your design to get started</p>
              </div>
            )}
          </div>
        </div>

        <div className="compliance-section">
          <h3>Real-time Compliance Check</h3>
          {renderComplianceStatus()}
          
          <div className="branding-reference">
            <h4>Branding Reference</h4>
            <div className="reference-colors">
              <h5>Allowed Colors:</h5>
              <div className="color-preview">
                {brandingData.colors.primary.map((color, index) => (
                  <div 
                    key={index}
                    className="color-dot"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div className="reference-spacing">
              <h5>Logo Requirements:</h5>
              <ul>
                <li>Min width: {brandingData.logo?.primary?.minWidth || 120}px</li>
                <li>Clear space: {brandingData.logo?.primary?.clearSpace || 20}px</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="canvas-actions">
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Guidelines
        </button>
        <button 
          className="btn-primary" 
          onClick={handleContinue}
          disabled={!complianceStatus || complianceStatus.overall === 'error'}
        >
          View Full Report
        </button>
      </div>
    </div>
  )
}

export default IllustrationCanvas
