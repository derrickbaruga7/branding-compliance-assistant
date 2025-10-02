import React, { useState } from 'react'
import { ImageIcon, Download, Loader2, Settings, Wand2, Copy, Check } from 'lucide-react'
import { generateImage } from '../services/fluxService'

const FluxGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [steps, setSteps] = useState(50)
  const [guidance, setGuidance] = useState(3.5)
  const [seed, setSeed] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      setError('Please enter a prompt for image generation')
      return
    }

    setIsLoading(true)
    setError('')
    setGeneratedImage(null)

    try {
      const result = await generateImage({
        prompt: prompt.trim(),
        negative_prompt: negativePrompt.trim(),
        width,
        height,
        steps,
        guidance,
        seed: seed || undefined
      })

      if (result.success) {
        setGeneratedImage(result.imageUrl)
      } else {
        setError(result.error || 'Failed to generate image')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Generation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `flux-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presetSizes = [
    { label: 'Square (1024x1024)', width: 1024, height: 1024 },
    { label: 'Portrait (768x1024)', width: 768, height: 1024 },
    { label: 'Landscape (1024x768)', width: 1024, height: 768 },
    { label: 'Wide (1280x720)', width: 1280, height: 720 },
    { label: 'Tall (720x1280)', width: 720, height: 1280 }
  ]

  const applyPreset = (preset) => {
    setWidth(preset.width)
    setHeight(preset.height)
  }

  return (
    <div>
      <form onSubmit={handleGenerate}>
        <div className="form-group">
          <label htmlFor="prompt">
            <Wand2 size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Image Prompt *
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate... (e.g., 'A cat holding a sign that says hello world')"
              required
            />
            {prompt && (
              <button
                type="button"
                onClick={handleCopyPrompt}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '5px'
                }}
                title="Copy prompt"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="negativePrompt">Negative Prompt (Optional)</label>
          <textarea
            id="negativePrompt"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="Describe what you don't want in the image... (e.g., 'blurry, low quality, distorted, text')"
          />
        </div>

        <div className="settings-grid">
          <div className="form-group">
            <label htmlFor="sizePreset">Size Preset</label>
            <select
              id="sizePreset"
              onChange={(e) => {
                const preset = presetSizes[parseInt(e.target.value)]
                if (preset) applyPreset(preset)
              }}
            >
              <option value="">Custom Size</option>
              {presetSizes.map((preset, index) => (
                <option key={index} value={index}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="width">Width</label>
            <input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value) || 1024)}
              min="256"
              max="2048"
              step="64"
            />
          </div>

          <div className="form-group">
            <label htmlFor="height">Height</label>
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 1024)}
              min="256"
              max="2048"
              step="64"
            />
          </div>

          <div className="form-group">
            <label htmlFor="steps">Inference Steps</label>
            <input
              id="steps"
              type="number"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 50)}
              min="1"
              max="100"
            />
            <small style={{ color: '#666', fontSize: '0.9rem' }}>Recommended: 50 steps for FLUX.1-dev</small>
          </div>

          <div className="form-group">
            <label htmlFor="guidance">Guidance Scale</label>
            <input
              id="guidance"
              type="number"
              value={guidance}
              onChange={(e) => setGuidance(parseFloat(e.target.value) || 3.5)}
              min="1"
              max="20"
              step="0.1"
            />
            <small style={{ color: '#666', fontSize: '0.9rem' }}>Recommended: 3.5 for FLUX.1-dev</small>
          </div>

          <div className="form-group">
            <label htmlFor="seed">Seed (Optional)</label>
            <input
              id="seed"
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Random if empty"
            />
          </div>
        </div>

        <button
          type="submit"
          className="generate-btn"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              <span>Generating Image...</span>
            </>
          ) : (
            <>
              <ImageIcon size={20} />
              <span>Generate Image</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {generatedImage && (
        <div className="image-result">
          <h3>Generated Image</h3>
          <img
            src={generatedImage}
            alt="Generated by Flux"
            className="generated-image"
          />
          <div>
            <button onClick={handleDownload} className="download-btn">
              <Download size={16} />
              Download Image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FluxGenerator


