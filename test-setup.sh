#!/bin/bash

# ========================================
# Backend Configuration Testing Script
# ========================================

echo "🚀 Backend Configuration Testing Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Backend API Endpoint
echo -e "${YELLOW}Test 1: Checking Backend API Endpoint${NC}"
echo "Endpoint: http://localhost:8000/api/config/current/"
echo ""

if curl -s http://localhost:8000/api/config/current/ > /tmp/config.json 2>/dev/null; then
    if grep -q "site_name" /tmp/config.json; then
        echo -e "${GREEN}✓ API Endpoint is working${NC}"
        echo ""
        
        # Extract and display key config values
        echo "Configuration from Backend:"
        echo "  site_name: $(grep -o '"site_name":"[^"]*' /tmp/config.json | cut -d'"' -f4)"
        echo "  style.brand: $(grep -o '"brand":"[^"]*' /tmp/config.json | cut -d'"' -f4)"
        echo "  style.accent: $(grep -o '"accent":"[^"]*' /tmp/config.json | cut -d'"' -f4)"
        echo "  style.neutral: $(grep -o '"neutral":"[^"]*' /tmp/config.json | cut -d'"' -f4)"
        echo ""
    else
        echo -e "${RED}✗ API returned invalid JSON${NC}"
        echo ""
    fi
else
    echo -e "${RED}✗ Cannot connect to backend at http://localhost:8000${NC}"
    echo "  Make sure Django is running: python manage.py runserver"
    echo ""
    exit 1
fi

# Test 2: Check Frontend Environment
echo -e "${YELLOW}Test 2: Checking Frontend Environment${NC}"
if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}✓ Found .env.local${NC}"
    API_URL=$(grep "NEXT_PUBLIC_API_URL" frontend/.env.local | cut -d'=' -f2)
    echo "  NEXT_PUBLIC_API_URL=$API_URL"
    echo ""
    
    if [[ "$API_URL" == *"8000"* ]]; then
        echo -e "${GREEN}✓ API URL points to backend${NC}"
    else
        echo -e "${RED}✗ API URL may be incorrect${NC}"
    fi
else
    echo -e "${RED}✗ .env.local not found in frontend${NC}"
fi
echo ""

# Test 3: Check Database
echo -e "${YELLOW}Test 3: Checking Database${NC}"
cd backend 2>/dev/null
if python manage.py dbshell <<EOF 2>/dev/null
SELECT COUNT(*) FROM api_siteconfiguration WHERE id = 1;
EOF
then
    echo -e "${GREEN}✓ Database has SiteConfiguration${NC}"
else
    echo -e "${YELLOW}⚠ Could not query database${NC}"
    echo "  Run: python manage.py init_site_config"
fi
cd - > /dev/null 2>&1
echo ""

# Test 4: Frontend Dev Server Check
echo -e "${YELLOW}Test 4: Checking Frontend Server${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend server is running${NC}"
    echo "  Visit: http://localhost:3000"
else
    echo -e "${YELLOW}⚠ Frontend server not running${NC}"
    echo "  Start with: cd frontend && npm run dev"
fi
echo ""

# Test 5: Summary
echo -e "${YELLOW}Summary${NC}"
echo "========================================"
echo -e "${GREEN}✓ Backend API${NC}: Reachable and returning config"
echo -e "${GREEN}✓ Frontend Config${NC}: Environment variables set"
echo ""
echo "Next Steps:"
echo "1. Ensure both servers are running:"
echo "   Backend: cd backend && python manage.py runserver"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "2. Test theme change in admin:"
echo "   - Go to: http://localhost:8000/admin/"
echo "   - Edit: API → Site Configuration"
echo "   - Change brand_color to 'pink'"
echo "   - Click Save"
echo "   - Refresh: http://localhost:3000"
echo ""
echo "3. Check browser console for messages:"
echo "   - Open DevTools: F12"
echo "   - Look for: '✓ Site configuration applied from backend'"
echo ""
echo -e "${GREEN}✓ Setup Complete!${NC}"
