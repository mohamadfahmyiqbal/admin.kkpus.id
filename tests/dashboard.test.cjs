// PATH: tests/dashboard.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');

// Import modules using dynamic imports for ES modules
test('Dashboard Component Security Test', async () => {
  const fs = require('fs');
  const path = require('path');
  
  // Read and validate dashboard components for security issues
  const dashboardPath = path.join(process.cwd(), 'src/pages/dashboard/Dashboard.jsx');
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  // Check for security vulnerabilities
  assert.ok(
    !dashboardContent.includes('document.querySelector'),
    'Dashboard contains direct DOM manipulation (security issue)'
  );
  
  assert.ok(
    !dashboardContent.includes('eval('),
    'Dashboard contains eval() (security issue)'
  );
  
  assert.ok(
    !dashboardContent.includes('<script>'),
    'Dashboard contains inline script tags (security issue)'
  );
  
  // Validate JWT encoding implementation
  const jwtEncodeRegex = /jwtEncode\s*\(/g;
  const jwtMatches = dashboardContent.match(jwtEncodeRegex);
  assert.ok(jwtMatches && jwtMatches.length > 0, 'Dashboard should use jwtEncode');
  
  // Check for valid JWT encoding with proper payload validation
  assert.ok(
    dashboardContent.includes('crypto.randomUUID()') || dashboardContent.includes('crypto.randomUUID'),
    'JWT encoding should include nonce for security'
  );
});

test('Dashboard State Management Test', async () => {
  const fs = require('fs');
  const path = require('path');
  
  const dashboardPath = path.join(process.cwd(), 'src/pages/dashboard/Dashboard.jsx');
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  // Check for proper React state management
  assert.ok(
    dashboardContent.includes('useState'),
    'Dashboard should use useState for state management'
  );
  
  assert.ok(
    dashboardContent.includes('useCallback'),
    'Dashboard should use useCallback for event handlers'
  );
  
  // Check for proper component structure - Dashboard uses forwardRef internally via child components
  assert.ok(
    dashboardContent.includes('forwardRef') || dashboardContent.includes('useRef'),
    'Dashboard should use useRef for DOM refs'
  );
});

test('Dashboard API Integration Test', async () => {
  const fs = require('fs');
  const path = require('path');
  
  const dashboardPath = path.join(process.cwd(), 'src/pages/dashboard/Dashboard.jsx');
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  // Check for proper API integration patterns
  assert.ok(
    dashboardContent.includes('useDashboardData'),
    'Dashboard should use useDashboardData hook'
  );
  
  assert.ok(
    dashboardContent.includes('fetchData'),
    'Dashboard should have fetchData functionality'
  );
});

test('Dashboard Error Handling Test', async () => {
  const fs = require('fs');
  const path = require('path');
  
  const dashboardPath = path.join(process.cwd(), 'src/pages/dashboard/components/DashboardApprovalModals.jsx');
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  // Check for proper error boundaries
  assert.ok(
    dashboardContent.includes('ErrorBoundary'),
    'DashboardApprovalModals should include ErrorBoundary'
  );
  
  assert.ok(
    dashboardContent.includes('ModalErrorFallback'),
    'DashboardApprovalModals should include ModalErrorFallback'
  );
  
  // Check for lazy loading with error boundaries
  assert.ok(
    dashboardContent.includes('Suspense'),
    'DashboardApprovalModals should include Suspense for lazy loading'
  );
});

test('Dashboard Component Import Validation', async () => {
  const fs = require('fs');
  const path = require('path');
  
  const componentsDir = path.join(process.cwd(), 'src/pages/dashboard/components');
  const componentFiles = fs.readdirSync(componentsDir);
  
  // Check that all component files have proper path comments
  componentFiles.forEach((file) => {
    if (file.endsWith('.jsx')) {
      const filePath = path.join(componentsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      assert.ok(
        content.startsWith('// PATH:'),
        `Component ${file} should have path comment header`
      );
    }
  });
});