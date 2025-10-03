# Test Files for Branding Compliance Assistant

This directory contains sample branding documents for testing the application's parsing and compliance checking capabilities.

## 📁 Available Test Files

### 1. `sample-brand-guidelines.txt`
Complete brand guidelines from ACME Corporation
- Logo usage specifications
- Color palette (primary, secondary, prohibited)
- Typography requirements
- Spacing rules
- General brand rules

### 2. `sample-logo-usage-rules.txt`
Logo specifications from TechStart Inc
- Primary and secondary logo requirements
- Clear space rules
- Approved/prohibited backgrounds
- Size guidelines for different applications

### 3. `sample-color-palette.txt`
Color guidelines from Innovate Corp
- Primary brand colors with hex codes
- Secondary and accent colors
- Prohibited colors with reasons
- Accessibility requirements

### 4. `sample-typography-guide.txt`
Typography specifications from Creative Studio
- Primary and secondary font families
- Size hierarchy and usage
- Responsive behavior rules
- Accessibility standards

## 🧪 Testing Scenarios

### Scrap Color Extraction
1. Upload `sample-color-palette.txt`
2. Verify extraction of:
   - Primary colors: #1E40AF, #059669
   - Secondary colors: #6B7280, #F9FAFB
   - Accent colors: #F59E0B, #DC2626
   - Prohibited colors: #32CD32, #FF1493

### Logo Size Validation
1. Upload `sample-logo-usage-rules.txt`
2. Test compliance with:
   - Minimum width: 120px (primary), 80px (secondary)
   - Clear space: 20px (primary), 15px (secondary)
   - Background restrictions

### Typography Compliance
1. Upload `sample-typography-guide.txt`
2. Check font requirements:
   - Primary font: Inter (weights 300-700)
   - Secondary font: Source Serif Pro
   - Size range: 12px minimum
   - Line height: 1.4-1.6

### Complete Brand Guidelines
1. Upload `sample-brand-guidelines.txt`
2. Test extraction of:
   - All color specifications
   - Logo requirements
   - Typography specs
   - Spacing rules
   - General guidelines

.## 📊 Expected Compliance Results

### Colors
- **Compliant**: Using brand colors (#0066CC, #CC0000)
- **Warning**: Using accent colors (limited usage)
- **Error**: Using prohibited colors (#00FF00, #FF1493)

### Logo
- **Compliant**: 120px+ width with proper clear space
- **Warning**: Size near minimum threshold
- **Error**: Below 120px width or insufficient clear space

### Typography
- **Compliant**: Helvetica Neue, proper sizing (12px+)
- **Warning**: Non-brand font usage
- **Error**: Text below 12px minimum

### Spacing
- **Compliant**: 40px+ margins on all sides
- **Warning**: Margins below recommended 30px
- **Error**: Margins below minimum 20px

## 🔧 Usage Instructions

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Test file upload**:
   - Navigate to the upload section
   - Drag and drop any sample file
   - Watch for parsing feedback

3. **Review extracted guidelines**:
   - Verify color extraction accuracy
   - Check logo specifications
   - Review typography requirements
   - Confirm spacing rules

4. **Test compliance checking**:
   - Upload test design images
   - Check real-time compliance feedback
   - Verify issue detection
   - Review suggestions

5. **Test export functionality**:
   - Generate compliance reports
   - Export branding guidelines
   - Verify report accuracy

## 📝 Creating Additional Test Files

To add new test files:

1. **Create document** with branding information
2. **Follow format** similar to existing files
3. **Include specifications**:
   - Colors (hex codes)
   - Typography (font names, sizes)
   - Logo requirements (dimensions, clear space)
   - Spacing rules (margins, padding)
   - Brand rules (general guidelines)

## 🐛 Troubleshooting

### File Upload Issues
- Ensure file size is reasonable (< 10MB)
- Check file format (TXT, PDF, DOCX, PNG, JPG)
- Verify file is readable

### Parsing Issues
- Check file encoding (UTF-8 recommended)
- Verify formatting consistency
- Test with simpler documents first

### Compliance Issues
- Check color format consistency
- Verify numerical values in specifications
- Test with known compliant designs

## 📞 Support

For issues with test files or parsing:
- Check application console for errors
- Verify file format and structure
- Test with provided sample files first
