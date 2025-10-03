#!/bin/bash

# GitHub Repository Setup Script for Branding Compliance Assistant
echo "🚀 Setting up GitHub repository for Branding Compliance Assistant..."

# Variables - CHANGE THESE TO YOUR GITHUB USERNAME
GITHUB_USERNAME="your-github-username"
REPO_NAME="branding-compliance-assistant"

echo "📝 Please update the GITHUB_USERNAME in this script with your actual GitHub username"
echo "Current username setting: $GITHUB_USERNAME"
read -p "Press Enter after you've updated the username in the script, or enter your GitHub username now: " USER_INPUT

if [ ! -z "$USER_INPUT" ]; then
    GITHUB_USERNAME="$USER_INPUT"
fi

echo "🐙 Setting up repository with username: $GITHUB_USERNAME"

# Create GitHub repository via GitHub CLI (if installed)
if command -v gh &> /dev/null; then
    echo "🔧 Creating GitHub repository using GitHub CLI..."
    gh repo create $REPO_NAME --public --description "Real-time branding compliance checker for designers and illustrators" --push --source=.
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository created successfully!"
        echo "🎉 Your app is now available at: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
    else
        echo "❌ Failed to create repository via GitHub CLI"
    fi
else
    echo "📝 GitHub CLI not found. Please create the repository manually:"
    echo ""
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: Real-time branding compliance checker for designers and illustrators"
    echo "4. Make it Public"
    echo "5. Click 'Create repository'"
    echo ""
    echo "Then run these commands:"
    echo ""
    echo "git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "git branch -M main"
    echo "git push -u origin main"
fi

echo ""
echo "🔧 After creating the repository, remember to:"
echo "1. Update package.json with your GitHub username"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Set source to 'GitHub Actions'"
echo ""
echo "📚 Documentation files created:"
echo "- README.md - Main project documentation"
echo "- CONTRIBUTING.md - Development guidelines"
echo "- DEMO.md - Feature demonstrations"
echo "- CHANGELOG.md - Version history"
echo "- LICENSE - MIT License"
echo ""
echo "🎯 Next steps:"
echo "1. Update repository URLs in package.json"
echo "2. Enable GitHub Pages deployment"
echo "3. Test the live application"
echo "4. Share with the community!"
