// Real-time branding compliance checker
export const checkCompliance = async (canvas, brandingData, image) => {
  return new Promise((resolve) => {
    // Simulate async processing
    setTimeout(() => {
      const results = {
        overall: 'compliant',
        issues: [],
        suggestions: [],
        details: {}
      }

      // Check colors
      const colorResults = checkColorCompliance(canvas, brandingData)
      if (colorResults.issues.length > 0) {
        results.issues.push(...colorResults.issues)
        results.overall = 'warning'
      }
      results.details.colors = colorResults

      // Check logo sizing
      const logoResults = checkLogoCompliance(canvas, brandingData)
      if (logoResults.issues.length > 0) {
        results.issues.push(...logoResults.issues)
        results.overall = 'error'
      }
      results.details.logo = logoResults

      // Check spacing
      const spacingResults = checkSpacingCompliance(canvas, brandingData)
      if (spacingResults.issues.length > 0) {
        results.issues.push(...spacingResults.issues)
        if (results.overall === 'compliant') results.overall = 'warning'
      }
      results.details.spacing = spacingResults

      // Generate suggestions
      results.suggestions = generateSuggestions(results.details)

      resolve(results)
    }, 1000)
  })
}

const checkColorCompliance = (canvas, brandingData) => {
  const results = {
    compliant: true,
    issues: [],
    foundColors: [],
    prohibitedColors: []
  }

  // Extract colors from canvas
  const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
  const colors = extractColorsFromImageData(imageData.data)
  
  results.foundColors = colors

  // Check against brand colors
  const allowedColors = [
    ...brandingData.colors.primary.map(c => c.hex.toLowerCase()),
    ...brandingData.colors.secondary.map(c => c.hex.toLowerCase())
  ]

  const prohibitedColors = brandingData.colors.prohibited?.map(c => c.hex.toLowerCase()) || []

  // Check for prohibited colors
  colors.forEach(color => {
    if (prohibitedColors.includes(color.toLowerCase())) {
      results.issues.push({
        type: 'color',
        severity: 'error',
        message: `Prohibited color detected: ${color}`,
        element: 'color-palette'
      })
      results.compliant = false
    }
  })

  // Check if too many colors are used
  if (colors.length > 5) {
    results.issues.push({
      type: 'color',
      severity: 'warning',
      message: `Too many colors used (${colors.length}). Consider using fewer colors for better brand consistency.`,
      element: 'color-palette'
    })
  }

  return results
}

const checkLogoCompliance = (canvas, brandingData) => {
  const results = {
    compliant: true,
    issues: [],
    logoSize: null,
    clearSpace: null
  }

  // Mock logo detection - in a real app you'd use image recognition
  const mockLogoWidth = Math.random() * 300 + 50 // Random width between 50-350px
  results.logoSize = mockLogoWidth

  const minWidth = brandingData.logo?.primary?.minWidth || 120
  const maxWidth = brandingData.logo?.primary?.maxWidth || 400

  if (mockLogoWidth < minWidth) {
    results.issues.push({
      type: 'logo',
      severity: 'error',
      message: `Logo is too small (${Math.round(mockLogoWidth)}px). Minimum width is ${minWidth}px.`,
      element: 'logo'
    })
    results.compliant = false
  }

  if (mockLogoWidth > maxWidth) {
    results.issues.push({
      type: 'logo',
      severity: 'warning',
      message: `Logo is larger than recommended (${Math.round(mockLogoWidth)}px). Maximum recommended width is ${maxWidth}px.`,
      element: 'logo'
    })
  }

  // Check clear space
  const requiredClearSpace = brandingData.logo?.primary?.clearSpace || 20
  const mockClearSpace = Math.random() * 30 + 10 // Random clear space
  results.clearSpace = mockClearSpace

  if (mockClearSpace < requiredClearSpace) {
    results.issues.push({
      type: 'logo',
      severity: 'warning',
      message: `Insufficient clear space around logo (${Math.round(mockClearSpace)}px). Required: ${requiredClearSpace}px.`,
      element: 'logo'
    })
  }

  return results
}

const checkSpacingCompliance = (canvas, brandingData) => {
  const results = {
    compliant: true,
    issues: [],
    margins: {},
    spacing: {}
  }

  // Mock spacing analysis
  const mockMargins = {
    top: Math.random() * 60 + 20,
    right: Math.random() * 60 + 20,
    bottom: Math.random() * 60 + 20,
    left: Math.random() * 60 + 20
  }

  results.margins = mockMargins

  const requiredMargin = brandingData.spacing?.pageMargins || 40

  Object.entries(mockMargins).forEach(([side, margin]) => {
    if (margin < requiredMargin) {
      results.issues.push({
        type: 'spacing',
        severity: 'warning',
        message: `${side} margin is too small (${Math.round(margin)}px). Minimum required: ${requiredMargin}px.`,
        element: 'margins'
      })
    }
  })

  return results
}

const extractColorsFromImageData = (imageData) => {
  const colorCounts = {}
  const colors = []

  // Sample every 100th pixel for performance
  for (let i = 0; i < imageData.length; i += 400) {
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]
    
    // Skip transparent/white pixels
    if (r > 250 && g > 250 && b > 250) continue
    
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    colorCounts[hex] = (colorCounts[hex] || 0) + 1
  }

  // Return top 10 most common colors
  return Object.entries(colorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([color]) => color)
}

const generateSuggestions = (details) => {
  const suggestions = []

  // Color suggestions
  if (details.colors && details.colors.foundColors.length > 3) {
    suggestions.push('Consider using fewer colors to maintain brand consistency')
  }

  // Logo suggestions
  if (details.logo && details.logo.logoSize) {
    if (details.logo.logoSize < 150) {
      suggestions.push('Consider increasing logo size for better visibility')
    }
  }

  // Spacing suggestions
  if (details.spacing && details.spacing.margins) {
    const margins = details.spacing.margins
    const avgMargin = (margins.top + margins.right + margins.bottom + margins.left) / 4
    if (avgMargin < 30) {
      suggestions.push('Increase margins for better visual balance')
    }
  }

  return suggestions
}
