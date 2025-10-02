import React, { useState } from 'react'
import { ArrowLeft, Download, RefreshCw, CheckCircle, AlertTriangle, XCircle, FileText, Palette, Ruler, Type } from 'lucide-react'

const ComplianceChecker = ({ results, brandingData, onBack, onNewProject }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={20} className="status-icon success" />
      case 'warning':
        return <AlertTriangle size={20} className="status-icon warning" />
      case 'error':
        return <XCircle size={20} className="status-icon error" />
      default:
        return <AlertTriangle size={20} className="status-icon" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return '#10B981'
      case 'warning':
        return '#F59E0B'
      case 'error':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const renderOverview = () => (
    <div className="compliance-overview">
      <div className="status-summary">
        <div className="status-header">
          {getStatusIcon(results.overall)}
          <h3>Compliance Status: {results.overall.toUpperCase()}</h3>
        </div>
        <div 
          className="status-bar"
          style={{ backgroundColor: getStatusColor(results.overall) }}
        ></div>
      </div>

      {results.issues && results.issues.length > 0 && (
        <div className="issues-summary">
          <h4>Issues Found ({results.issues.length})</h4>
          <div className="issues-list">
            {results.issues.map((issue, index) => (
              <div key={index} className={`issue-item ${issue.severity}`}>
                <div className="issue-header">
                  <span className="issue-type">{issue.type}</span>
                  <span className="issue-severity">{issue.severity}</span>
                </div>
                <p className="issue-message">{issue.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.suggestions && results.suggestions.length > 0 && (
        <div className="suggestions-summary">
          <h4>Suggestions ({results.suggestions.length})</h4>
          <div className="suggestions-list">
            {results.suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <CheckCircle size={16} className="suggestion-icon" />
                <span className="suggestion-text">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderColorDetails = () => (
    <div className="compliance-details">
      <h3><Palette size={20} /> Color Compliance</h3>
      
      {results.details.colors && (
        <div className="color-analysis">
          <div className="analysis-section">
            <h4>Found Colors</h4>
            <div className="color-grid">
              {results.details.colors.foundColors.map((color, index) => (
                <div key={index} className="color-item">
                  <div 
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="color-hex">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-section">
            <h4>Brand Colors</h4>
            <div className="brand-colors">
              <div className="color-group">
                <h5>Primary Colors</h5>
                <div className="color-grid">
                  {brandingData.colors.primary.map((color, index) => (
                    <div key={index} className="color-item">
                      <div 
                        className="color-swatch"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <span className="color-name">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderLogoDetails = () => (
    <div className="compliance-details">
      <h3><FileText size={20} /> Logo Compliance</h3>
      
      {results.details.logo && (
        <div className="logo-analysis">
          <div className="analysis-section">
            <h4>Logo Specifications</h4>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Current Size:</span>
                <span className="spec-value">{Math.round(results.details.logo.logoSize)}px</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Clear Space:</span>
                <span className="spec-value">{Math.round(results.details.logo.clearSpace)}px</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Min Required:</span>
                <span className="spec-value">{brandingData.logo?.primary?.minWidth || 120}px</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Max Recommended:</span>
                <span className="spec-value">{brandingData.logo?.primary?.maxWidth || 400}px</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderSpacingDetails = () => (
    <div className="compliance-details">
      <h3><Ruler size={20} /> Spacing Compliance</h3>
      
      {results.details.spacing && (
        <div className="spacing-analysis">
          <div className="analysis-section">
            <h4>Current Margins</h4>
            <div className="margins-grid">
              <div className="margin-item">
                <span className="margin-label">Top:</span>
                <span className="margin-value">{Math.round(results.details.spacing.margins.top)}px</span>
              </div>
              <div className="margin-item">
                <span className="margin-label">Right:</span>
                <span className="margin-value">{Math.round(results.details.spacing.margins.right)}px</span>
              </div>
              <div className="margin-item">
                <span className="margin-label">Bottom:</span>
                <span className="margin-value">{Math.round(results.details.spacing.margins.bottom)}px</span>
              </div>
              <div className="margin-item">
                <span className="margin-label">Left:</span>
                <span className="margin-value">{Math.round(results.details.spacing.margins.left)}px</span>
              </div>
            </div>
          </div>

          <div className="analysis-section">
            <h4>Required Margins</h4>
            <div className="required-margins">
              <p>Minimum margin: {brandingData.spacing?.pageMargins || 40}px on all sides</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'colors':
        return renderColorDetails()
      case 'logo':
        return renderLogoDetails()
      case 'spacing':
        return renderSpacingDetails()
      default:
        return renderOverview()
    }
  }

  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      brandName: brandingData.brandName,
      overallStatus: results.overall,
      issues: results.issues || [],
      suggestions: results.suggestions || [],
      details: results.details || {}
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compliance-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="compliance-container">
      <div className="compliance-header">
        <h2>Compliance Report</h2>
        <p>Detailed analysis of your design's branding compliance</p>
      </div>

      <div className="compliance-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <CheckCircle size={16} />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'colors' ? 'active' : ''}`}
          onClick={() => setActiveTab('colors')}
        >
          <Palette size={16} />
          Colors
        </button>
        <button 
          className={`tab ${activeTab === 'logo' ? 'active' : ''}`}
          onClick={() => setActiveTab('logo')}
        >
          <FileText size={16} />
          Logo
        </button>
        <button 
          className={`tab ${activeTab === 'spacing' ? 'active' : ''}`}
          onClick={() => setActiveTab('spacing')}
        >
          <Ruler size={16} />
          Spacing
        </button>
      </div>

      <div className="compliance-content">
        {renderTabContent()}
      </div>

      <div className="compliance-actions">
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Canvas
        </button>
        <button className="btn-secondary" onClick={generateReport}>
          <Download size={16} />
          Download Report
        </button>
        <button className="btn-primary" onClick={onNewProject}>
          <RefreshCw size={16} />
          New Project
        </button>
      </div>
    </div>
  )
}

export default ComplianceChecker
