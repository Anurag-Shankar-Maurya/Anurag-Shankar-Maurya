#!/bin/bash

# Test the backend API endpoint
echo "Testing Backend API..."
curl -s http://localhost:8000/api/config/current/ | jq '.' > /tmp/config.json

if [ -s /tmp/config.json ]; then
    echo "✓ Backend API is working"
    echo "Configuration:"
    cat /tmp/config.json | jq '{style: .style, display: .display}'
else
    echo "✗ Backend API is not responding"
    exit 1
fi

echo ""
echo "Next steps:"
echo "1. Restart the frontend: npm run dev"
echo "2. Open browser and check if theme changes"
echo "3. Go to http://localhost:8000/admin/"
echo "4. Change a config value (e.g., brand color)"
echo "5. Refresh the frontend to see the change"
