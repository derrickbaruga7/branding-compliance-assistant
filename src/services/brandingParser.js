import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'

// Mock branding data structure
const createMockBrandingData = () => ({
  brandName: 'Example Brand',
  logo: {
    primary: {
      url: 'https://via.placeholder.com/200x100/0066CC/FFFFFF?text=LOGO',
      minWidth: 120,
      maxWidth: 400,
      clearSpace: 20,
      allowedBackgrounds: ['white', 'transparent'],
      prohibitedBackgrounds: ['black', 'dark-blue']
    },
    secondary: {
      url: 'https://via.placeholder.com/200x100/FFFFFF/0066CC?text=LOGO',
      minWidth: 80,
      maxWidth: 300,
      clearSpace: 15,
      allowedBackgrounds: ['black', 'dark-blue'],
      prohibitedBackgrounds: ['white', 'light-gray']
    }
  },
  colors: {
    primary: [
      { name: 'Brand Blue', hex: '#0066CC', rgb: 'rgb(0, 102, 204)', usage: 'Primary brand color' },
      { name: 'Brand Red', hex: '#CC0000', rgb: 'rgb(204, 0, 0)', usage: 'Accent color' }
    ],
    secondary: [
      { name: 'Light Gray', hex: '#F5F5F5', rgb: 'rgb(245, 245, 245)', usage: 'Background' },
      { name: 'Dark Gray', hex: '#333333', rgb: 'rgb(51, 51, 51)', usage: 'Text' }
    ],
    prohibited: [
      { name: 'Neon Green', hex: '#00FF00', reason: 'Too bright, conflicts with brand' },
      { name: 'Hot Pink', hex: '#FF1493', reason: 'Not part of brand palette' }
    ]
  },
  typography: {
    primary: {
      fontFamily: 'Helvetica Neue',
      weights: ['300', '400', '600', '700'],
      sizes: { min: 12, max: 72 },
      lineHeight: 1.4
    },
    secondary: {
      fontFamily: 'Georgia',
      weights: ['400', '700'],
      sizes: { min: 10, max: 48 },
      lineHeight: 1.5
    }
  },
  spacing: {
    logoClearSpace: 20,
    textSpacing: 16,
    sectionSpacing: 32,
    pageMargins: 40
  },
  rules: [
    'Logo must maintain clear space equal to height of the "O" in the logo',
    'Primary color should be used for headlines and important elements',
    'Never use more than 3 colors in a single design',
    'Logo should never be smaller than 120px wide',
    'Text should never be smaller than 12px',
    'Always maintain 40px margins on all sides'
  ]
})

export const parseBrandingDocument = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const data = e.target.result
        let extractedData = null

        // Determine file type and parse accordingly
        if (file.type === 'application/pdf') {
          // For PDF files, we'll use a mock parser for now
          // In a real implementation, you'd use pdf-parse or similar
          console.log('PDF file detected, using mock parser')
          extractedData = createMockBrandingData()
        } else if (file.type.includes('wordprocessingml') || file.type.includes('msword')) {
          // For Word documents
          console.log('Word document detected, using mammoth parser')
          const result = await mammoth.extractRawText({ arrayBuffer: data })
          extractedData = parseTextContent(result.value)
        } else if (file.type.startsWith('image/')) {
          // For image files, we'll extract colors and basic info
          console.log('Image file detected, extracting color palette')
          extractedData = await extractColorsFromImage(file)
        } else if (file.type === 'text/plain') {
          // For text files
          console.log('Text file detected, parsing content')
          const text = new TextDecoder().decode(data)
          extractedData = parseTextContent(text)
        } else {
          throw new Error('Unsupported file type')
        }

        // Enhance with mock data if parsing didn't extract enough
        if (!extractedData || Object.keys(extractedData).length < 3) {
          extractedData = { ...createMockBrandingData(), ...extractedData }
        }

        resolve(extractedData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    // Read file based on type
    if (file.type.startsWith('text/') || file.type.includes('wordprocessingml') || file.type.includes('msword')) {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsDataURL(file)
    }
  })
}

const parseTextContent = (text) => {
  // Simple text parsing to extract branding information
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  const brandingData = {
    brandName: 'Extracted Brand',
    colors: { primary: [], secondary: [], prohibited: [] },
    typography: { primary: {}, secondary: {} },
    spacing: {},
    rules: []
  }

  // Extract color information
  const colorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g
  const colors = text.match(colorRegex) || []
  
  colors.forEach((color, index) => {
    if (index < 2) {
      brandingData.colors.primary.push({
        name: `Color ${index + 1}`,
        hex: color,
        usage: 'Primary brand color'
      })
    }
  })

  // Extract rules and guidelines
  lines.forEach(line => {
    if (line.toLowerCase().includes('logo') || 
        line.toLowerCase().includes('color') || 
        line.toLowerCase().includes('font') ||
        line.toLowerCase().includes('spacing') ||
        line.toLowerCase().includes('size')) {
      brandingData.rules.push(line)
    }
  })

  return brandingData
}

const extractColorsFromImage = async (file) => {
  return new Promise((resolve) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const colors = extractDominantColors(imageData.data)
      
      resolve({
        brandName: 'Image Brand',
        colors: {
          primary: colors.slice(0, 3).map((color, index) => ({
            name: `Primary Color ${index + 1}`,
            hex: color,
            usage: 'Extracted from image'
          })),
          secondary: [],
          prohibited: []
        },
        rules: ['Colors extracted from uploaded image']
      })
    }
    
    img.src = URL.createObjectURL(file)
  })
}

const extractDominantColors = (imageData) => {
  const colorCounts = {}
  const colors = []
  
  // Sample every 10th pixel for performance
  for (let i = 0; i < imageData.length; i += 40) {
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    
    colorCounts[hex] = (colorCounts[hex] || 0) + 1
  }
  
  // Sort by frequency and return top colors
  return Object.entries(colorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([color]) => color)
}
