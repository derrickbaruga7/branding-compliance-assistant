import axios from 'axios'

// Hugging Face Inference API configuration for FLUX.1-dev
const HF_API_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev'
const HF_API_KEY = process.env.REACT_APP_HF_API_KEY

// For development, we'll use a mock service that simulates the API call
const isDevelopment = process.env.NODE_ENV === 'development'

const generateImage = async (params) => {
  try {
    if (isDevelopment && !HF_API_KEY) {
      // Mock response for development when no API key is provided
      console.log('Development mode: Using mock image generation (no API key provided)')
      return new Promise((resolve) => {
        setTimeout(() => {
          // Generate a placeholder image URL
          const mockImageUrl = `https://picsum.photos/${params.width}/${params.height}?random=${Date.now()}`
          resolve({
            success: true,
            imageUrl: mockImageUrl
          })
        }, 3000) // Simulate 3 second generation time
      })
    }

    if (!HF_API_KEY) {
      return {
        success: false,
        error: 'Hugging Face API key not configured. Please add REACT_APP_HF_API_KEY to your environment variables.'
      }
    }

    // Use Hugging Face Inference API for FLUX.1-dev
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: params.prompt,
        parameters: {
          negative_prompt: params.negative_prompt || '',
          width: params.width,
          height: params.height,
          num_inference_steps: params.steps,
          guidance_scale: params.guidance,
          seed: params.seed ? parseInt(params.seed) : undefined
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob',
        timeout: 120000 // 2 minute timeout for HF
      }
    )

    // Convert blob to data URL
    const imageBlob = response.data
    const imageUrl = URL.createObjectURL(imageBlob)

    return {
      success: true,
      imageUrl: imageUrl
    }
  } catch (error) {
    console.error('FLUX.1-dev API Error:', error)
    
    if (error.response) {
      // API responded with error status
      const errorData = error.response.data
      let errorMessage = 'API Error: '
      
      if (typeof errorData === 'string') {
        errorMessage += errorData
      } else if (errorData?.error) {
        errorMessage += errorData.error
      } else {
        errorMessage += error.response.statusText || 'Unknown error'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      }
    } else {
      // Other error
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      }
    }
  }
}

export { generateImage }


