import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Image, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { parseBrandingDocument } from '../services/brandingParser'

const BrandingUploader = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [error, setError] = useState('')

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploading(true)
    setError('')
    setUploadStatus('Processing branding document...')

    try {
      const brandingData = await parseBrandingDocument(file)
      setUploadStatus('Branding guidelines parsed successfully!')
      setTimeout(() => {
        onUpload(brandingData)
      }, 1000)
    } catch (err) {
      setError(`Failed to parse branding document: ${err.message}`)
      setUploadStatus(null)
    } finally {
      setUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'text/plain': ['.txt']
    },
    multiple: false
  })

  return (
    <div className="uploader-container">
      <div className="uploader-header">
        <h2>Upload Branding Guidelines</h2>
        <p>Upload your brand guidelines document to get started with compliance checking</p>
      </div>

      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="upload-content">
            <Loader2 size={48} className="spinner" />
            <p>{uploadStatus}</p>
          </div>
        ) : (
          <div className="upload-content">
            <Upload size={48} className="upload-icon" />
            <h3>
              {isDragActive ? 'Drop your file here' : 'Drag & drop your branding guidelines'}
            </h3>
            <p>or click to browse files</p>
            <div className="supported-formats">
              <span>Supported formats:</span>
              <div className="format-tags">
                <span className="format-tag">PDF</span>
                <span className="format-tag">DOCX</span>
                <span className="format-tag">PNG</span>
                <span className="format-tag">JPG</span>
                <span className="format-tag">TXT</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {uploadStatus && !uploading && (
        <div className="upload-success">
          <CheckCircle size={20} />
          <span>{uploadStatus}</span>
        </div>
      )}

      {error && (
        <div className="upload-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="upload-info">
        <h4>What we'll extract from your guidelines:</h4>
        <ul>
          <li><FileText size={16} /> Logo usage rules and restrictions</li>
          <li><Image size={16} /> Color palette and usage guidelines</li>
          <li><AlertCircle size={16} /> Typography specifications</li>
          <li><CheckCircle size={16} /> Spacing and sizing requirements</li>
        </ul>
      </div>
    </div>
  )
}

export default BrandingUploader
