import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Palette, Type, Ruler, AlertTriangle, CheckCircle, Info } from 'lucide-react'

const BrandingGuidelines = ({ brandingData, onContinue, onBack }) => {
  const [activeTab, setActiveTab] = useState('colors')

  const renderColorPalette = () => (
    <div className="guidelines-section">
      <h3><Palette size={20} /> Color Palette</h3>
      
      {brandingData.colors.primary.length > 0 && (
        <div className="color-group">
          <h4>Primary Colors</h4>
          <div className="color-grid">
            {brandingData.colors.primary.map((color, index) => (
              <div key={index} className="color-item">
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: color.hex }}
                ></div>
                <div className="color-info">
                  <div className="color-name">{color.name}</div>
                  <div className="color-hex">{color.hex}</div>
                  <div className="color-usage">{color.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {brandingData.colors.secondary.length > 0 && (
        <div className="color-group">
          <h4>Secondary Colors</h4>
          <div className="color-grid">
            {brandingData.colors.secondary.map((color, index) => (
              <div key={index} className="color-item">
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: color.hex }}
                ></div>
                <div className="color-info">
                  <div className="color-name">{color.name}</div>
                  <div className="color-hex">{color.hex}</div>
                  <div className="color-usage">{color.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {brandingData.colors.prohibited.length > 0 && (
        <div className="color-group prohibited">
          <h4><AlertTriangle size={16} /> Prohibited Colors</h4>
          <div className="color-grid">
            {brandingData.colors.prohibited.map((color, index) => (
              <div key={index} className="color-item prohibited">
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: color.hex }}
                ></div>
                <div className="color-info">
                  <div className="color-name">{color.name}</div>
                  <div className="color-hex">{color.hex}</div>
                  <div className="color-usage">{color.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderTypography = () => (
    <div className="guidelines-section">
      <h3><Type size={20} /> Typography</h3>
      
      {brandingData.typography.primary && (
        <div className="typography-group">
          <h4>Primary Font</h4>
          <div className="font-specs">
            <div className="font-item">
              <span className="font-label">Font Family:</span>
              <span className="font-value">{brandingData.typography.primary.fontFamily}</span>
            </div>
            <div className="font-item">
              <span className="font-label">Weights:</span>
              <span className="font-value">{brandingData.typography.primary.weights?.join(', ')}</span>
            </div>
            <div className="font-item">
              <span className="font-label">Size Range:</span>
              <span className="font-value">{brandingData.typography.primary.sizes?.min}px - {brandingData.typography.primary.sizes?.max}px</span>
            </div>
            <div className="font-item">
              <span className="font-label">Line Height:</span>
              <span className="font-value">{brandingData.typography.primary.lineHeight}</span>
            </div>
          </div>
        </div>
      )}

      {brandingData.typography.secondary && (
        <div className="typography-group">
          <h4>Secondary Font</h4>
          <div className="font-specs">
            <div className="font-item">
              <span className="font-label">Font Family:</span>
              <span className="font-value">{brandingData.typography.secondary.fontFamily}</span>
            </div>
            <div className="font-item">
              <span className="font-label">Weights:</span>
              <span className="font-value">{brandingData.typography.secondary.weights?.join(', ')}</span>
            </div>
            <div className="font-item">
              <span className="font-label">Size Range:</span>
              <span className="font-value">{brandingData.typography.secondary.sizes?.min}px - {brandingData.typography.secondary.sizes?.max}px</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderSpacing = () => (
    <div className="guidelines-section">
      <h3><Ruler size={20} /> Spacing & Sizing</h3>
      
      {brandingData.spacing && (
        <div className="spacing-group">
          <div className="spacing-item">
            <span className="spacing-label">Logo Clear Space:</span>
            <span className="spacing-value">{brandingData.spacing.logoClearSpace}px</span>
          </div>
          <div className="spacing-item">
            <span className="spacing-label">Text Spacing:</span>
            <span className="spacing-value">{brandingData.spacing.textSpacing}px</span>
          </div>
          <div className="spacing-item">
            <span className="spacing-label">Section Spacing:</span>
            <span className="spacing-value">{brandingData.spacing.sectionSpacing}px</span>
          </div>
          <div className="spacing-item">
            <span className="spacing-label">Page Margins:</span>
            <span className="spacing-value">{brandingData.spacing.pageMargins}px</span>
          </div>
        </div>
      )}

      {brandingData.logo && (
        <div className="logo-specs">
          <h4>Logo Specifications</h4>
          {brandingData.logo.primary && (
            <div className="logo-variant">
              <h5>Primary Logo</h5>
              <div className="logo-info">
                <div className="logo-item">
                  <span className="logo-label">Min Width:</span>
                  <span className="logo-value">{brandingData.logo.primary.minWidth}px</span>
                </div>
                <div className="logo-item">
                  <span className="logo-label">Max Width:</span>
                  <span className="logo-value">{brandingData.logo.primary.maxWidth}px</span>
                </div>
                <div className="logo-item">
                  <span className="logo-label">Clear Space:</span>
                  <span className="logo-value">{brandingData.logo.primary.clearSpace}px</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderRules = () => (
    <div className="guidelines-section">
      <h3><Info size={20} /> Brand Rules</h3>
      
      <div className="rules-list">
        {brandingData.rules.map((rule, index) => (
          <div key={index} className="rule-item">
            <CheckCircle size={16} className="rule-icon" />
            <span className="rule-text">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'colors':
        return renderColorPalette()
      case 'typography':
        return renderTypography()
      case 'spacing':
        return renderSpacing()
      case 'rules':
        return renderRules()
      default:
        return renderColorPalette()
    }
  }

  return (
    <div className="guidelines-container">
      <div className="guidelines-header">
        <h2>Brand Guidelines: {brandingData.brandName}</h2>
        <p>Review the extracted branding guidelines before creating your design</p>
      </div>

      <div className="guidelines-tabs">
        <button 
          className={`tab ${activeTab === 'colors' ? 'active' : ''}`}
          onClick={() => setActiveTab('colors')}
        >
          <Palette size={16} />
          Colors
        </button>
        <button 
          className={`tab ${activeTab === 'typography' ? 'active' : ''}`}
          onClick={() => setActiveTab('typography')}
        >
          <Type size={16} />
          Typography
        </button>
        <button 
          className={`tab ${activeTab === 'spacing' ? 'active' : ''}`}
          onClick={() => setActiveTab('spacing')}
        >
          <Ruler size={16} />
          Spacing
        </button>
        <button 
          className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <Info size={16} />
          Rules
        </button>
      </div>

      <div className="guidelines-content">
        {renderTabContent()}
      </div>

      <div className="guidelines-actions">
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Upload
        </button>
        <button className="btn-primary" onClick={onContinue}>
          Continue to Design
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default BrandingGuidelines
