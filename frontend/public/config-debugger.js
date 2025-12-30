/**
 * Config Debugger - Add to browser console for debugging
 * Copy and paste into browser console for live debugging
 */

// This script can be run in browser console to debug configuration loading
(function() {
  console.log('%c🔧 Config Debugger', 'color: blue; font-size: 14px; font-weight: bold;');
  
  // Check environment
  console.log('%cEnvironment:', 'color: green; font-weight: bold;');
  console.log('API Base URL:', window.location.origin);
  console.log('Current Route:', window.location.pathname);
  
  // Check DOM attributes
  console.log('%cTheme Attributes:', 'color: green; font-weight: bold;');
  const root = document.documentElement;
  const attrs = [
    'data-theme',
    'data-brand',
    'data-accent',
    'data-neutral',
    'data-solid',
    'data-solid-style',
    'data-border',
    'data-surface',
    'data-transition',
    'data-scaling',
  ];
  
  attrs.forEach(attr => {
    const value = root.getAttribute(attr);
    const status = value ? '✓' : '✗';
    console.log(`${status} ${attr}: ${value || 'NOT SET'}`);
  });
  
  // Test API endpoint
  console.log('%cAPI Test:', 'color: green; font-weight: bold;');
  const apiUrl = `${window.location.protocol}//${window.location.hostname}:8000/api/config/current/`;
  console.log('Testing:', apiUrl);
  
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      console.log('✓ API Response:');
      console.log('Site Name:', data.site_name);
      console.log('Theme Style:', data.style);
      console.log('Display:', data.display);
    })
    .catch(err => {
      console.error('✗ API Error:', err.message);
    });
  
  // Helper function to manually apply config
  window.applyConfigDebug = function(configData) {
    console.log('Applying config...');
    const root = document.documentElement;
    if (configData.style) {
      root.setAttribute('data-brand', configData.style.brand);
      root.setAttribute('data-accent', configData.style.accent);
      root.setAttribute('data-neutral', configData.style.neutral);
      root.setAttribute('data-solid-style', configData.style.solidStyle);
      root.setAttribute('data-border', configData.style.border);
      root.setAttribute('data-surface', configData.style.surface);
      root.setAttribute('data-transition', configData.style.transition);
      root.setAttribute('data-scaling', configData.style.scaling);
    }
    console.log('✓ Config applied');
  };
  
  console.log('%cDebug Commands:', 'color: green; font-weight: bold;');
  console.log('applyConfigDebug(config) - Manually apply a config object');
  console.log('Example: applyConfigDebug({ style: { brand: "pink", accent: "red" } })');
})();
