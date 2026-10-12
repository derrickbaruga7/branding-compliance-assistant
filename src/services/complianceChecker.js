// Sampled color checks; logo, typography, and layout require manual review.
export const checkCompliance = async (canvas, brandingData) => {
  // An async function rejects normally if canvas access fails.
  const colors = checkColorCompliance(canvas, brandingData)
  const issues = [...colors.issues, {
    type: 'manual-review',
    severity: 'warning',
    message: 'Logo size, clear space, typography, and margins are not assessed. Review these against the original guidelines.',
    element: 'design'
  }]
  return {
    overall: issues.some(issue => issue.severity === 'error') ? 'error' : 'warning',
    issues,
    suggestions: ['Color checks sample pixels and may miss small details. Review the complete design manually.'],
    details: {
      colors,
      logo: { status: 'not-assessed', compliant: null, issues: [], logoSize: null, clearSpace: null },
      spacing: { status: 'not-assessed', compliant: null, issues: [], margins: {}, spacing: {} }
    }
  }
}

const normalizeHex = value => {
  const color = value.toLowerCase()
  return /^#[0-9a-f]{3}$/.test(color)
    ? '#' + [...color.slice(1)].map(char => char + char).join('')
    : color
}

const checkColorCompliance = (canvas, brandingData) => {
  const results = {
    compliant: true,
    status: 'sampled',
    issues: [],
    foundColors: [],
    prohibitedColors: []
  }

  // Extract colors from canvas
  const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
  const colors = extractColorsFromImageData(imageData.data)

  results.foundColors = colors

  const prohibitedColors = brandingData.colors?.prohibited?.map(c => normalizeHex(c.hex)) || []

  // Check for prohibited colors
  colors.forEach(color => {
    if (prohibitedColors.includes(color.toLowerCase())) {
      results.issues.push({
        type: 'color',
        severity: 'error',
        message: `Prohibited color detected: ${color}`,
        element: 'color-palette'
      })
      results.prohibitedColors.push(color)
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

const extractColorsFromImageData = (imageData) => {
  const colorCounts = {}

  // Sample every 100th pixel for performance
  for (let i = 0; i < imageData.length; i += 400) {
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]

    // Transparent pixels do not contribute a visible color.
    if (imageData[i + 3] === 0) continue

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    colorCounts[hex] = (colorCounts[hex] || 0) + 1
  }

  // Return top 10 most common colors
  return Object.entries(colorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([color]) => color)
}
