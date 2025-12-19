#!/bin/bash

# Local Build Workaround for Frontend
# Use this if Docker build keeps failing due to network issues

echo "🔨 Building frontend locally..."

cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build Next.js
echo "🏗️  Building Next.js..."
npm run build

echo "✅ Local build complete!"
echo ""
echo "Now you can use the lightweight Dockerfile:"
echo "  docker build -f Dockerfile.local -t hotelapp-frontend ."
echo ""
echo "Or run locally:"
echo "  npm start"

