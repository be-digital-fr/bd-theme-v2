#!/bin/bash

# Quick Lighthouse Test Script
# Usage: ./scripts/quick-lighthouse.sh [URL] [device]

URL="${1:-https://bd-theme-nu.vercel.app}"
DEVICE="${2:-desktop}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_DIR="./lighthouse-reports/${TIMESTAMP}"

echo "🚀 Quick Lighthouse Performance Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 URL: $URL"
echo "💻 Device: $DEVICE"
echo "📊 Output: $OUTPUT_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Test if URL is accessible
echo "🔍 Checking if URL is accessible..."
if ! curl -s --head "$URL" | head -n 1 | grep -q "200 OK"; then
    echo "❌ URL is not accessible or not returning 200 OK"
    echo "🔄 Retrying in 10 seconds..."
    sleep 10
    if ! curl -s --head "$URL" | head -n 1 | grep -q "200 OK"; then
        echo "❌ URL still not accessible. Please check the URL and try again."
        exit 1
    fi
fi

echo "✅ URL is accessible"

# Run Unlighthouse
echo "📡 Running Lighthouse scan..."
npx unlighthouse \
    --site "$URL" \
    --samples 5 \
    --device "$DEVICE" \
    --output-path "$OUTPUT_DIR" \
    --throttle \
    --verbose

# Check if scan was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Lighthouse scan completed successfully!"
    echo "📊 Reports available at: $OUTPUT_DIR"
    
    # Try to open the report in browser (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if [ -f "$OUTPUT_DIR/index.html" ]; then
            echo "🌐 Opening report in browser..."
            open "$OUTPUT_DIR/index.html"
        fi
    fi
    
    # Display quick summary if available
    if [ -f "$OUTPUT_DIR/ci-result.json" ]; then
        echo ""
        echo "📋 Quick Summary:"
        cat "$OUTPUT_DIR/ci-result.json" | grep -E "(performance|accessibility|best-practices|seo)" | head -5
    fi
else
    echo "❌ Lighthouse scan failed"
    exit 1
fi

echo ""
echo "🎯 Performance Tips:"
echo "• Check Core Web Vitals in the detailed report"
echo "• Focus on First Contentful Paint < 1.8s"
echo "• Keep Largest Contentful Paint < 2.5s"
echo "• Maintain Cumulative Layout Shift < 0.1"
echo "• Optimize Total Blocking Time < 300ms"
echo ""