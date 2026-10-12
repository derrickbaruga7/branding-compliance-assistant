import mammoth from 'mammoth'

export const parseBrandingDocument = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const data = e.target.result
        let extractedData = null

        // Determine file type and parse accordingly
        if (file.type === 'application/pdf') {
          throw new Error('PDF parsing is not available yet. Export the guidelines as TXT or DOCX.')
        } else if (file.type.includes('msword')) {
          throw new Error('Legacy DOC files are not supported. Save the document as DOCX or TXT.')
        } else if (file.type.includes('wordprocessingml')) {
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
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      try {
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
          typography: { primary: {}, secondary: {} },
          spacing: {},
          rules: ['Colors extracted from uploaded image']
        })
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Unable to decode the uploaded image. Try a PNG or JPEG.'))
    }
    img.src = objectUrl
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
