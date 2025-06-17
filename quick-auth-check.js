const { chromium } = require('playwright');

/**
 * Quick Authentication Status Check
 * A lightweight test to verify critical authentication issues are resolved
 */

async function quickAuthCheck() {
  console.log('🔍 Quick Authentication Status Check...\n');
  
  let browser, page;
  
  try {
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000
    });
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
    
    let errorCount = 0;
    let criticalErrors = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        errorCount++;
        
        // Check for critical errors
        if (text.includes('Cannot destructure property') || 
            text.includes('authToken') ||
            text.includes('useAuth') ||
            text.includes('Module not found')) {
          criticalErrors.push(text);
        }
        
        console.log(`❌ Console Error: ${text}`);
      }
    });
    
    page.on('pageerror', error => {
      errorCount++;
      criticalErrors.push(error.message);
      console.log(`💥 Page Error: ${error.message}`);
    });
    
    // Test 1: Load home page
    console.log('📍 Testing home page...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    const title = await page.title();
    console.log(`   Title: ${title}`);
    
    // Test 2: Check if React app root exists
    const appRoot = await page.$('#root');
    if (appRoot) {
      console.log('   ✅ React app root found');
    } else {
      console.log('   ❌ React app root not found');
      criticalErrors.push('React app root not found');
    }
    
    // Test 3: Try login page
    console.log('📍 Testing login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(3000);
    
    // Test 4: Try dashboard page
    console.log('📍 Testing dashboard page...');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(3000);
    
    // Test 5: Check API connectivity
    console.log('📍 Testing API connectivity...');
    const apiResponse = await page.evaluate(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health');
        const data = await res.json();
        return { status: res.status, data };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    if (apiResponse.error) {
      console.log(`   ❌ API Error: ${apiResponse.error}`);
      criticalErrors.push(`API Error: ${apiResponse.error}`);
    } else if (apiResponse.status === 200) {
      console.log('   ✅ API connectivity working');
    }
    
    // Summary
    console.log('\n🎯 QUICK CHECK RESULTS:');
    console.log(`   📊 Total Console Errors: ${errorCount}`);
    console.log(`   🚨 Critical Errors: ${criticalErrors.length}`);
    
    if (criticalErrors.length === 0) {
      console.log('   🎉 SUCCESS: No critical authentication errors detected!');
      console.log('   ✅ Application appears to be working properly');
      return true;
    } else {
      console.log('   ❌ CRITICAL ISSUES STILL PRESENT:');
      criticalErrors.forEach((error, index) => {
        console.log(`      ${index + 1}. ${error}`);
      });
      return false;
    }
    
  } catch (error) {
    console.error('❌ Quick check failed:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the quick check
if (require.main === module) {
  quickAuthCheck().then(success => {
    console.log(`\n🏁 Quick Check ${success ? 'PASSED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Quick check error:', error);
    process.exit(1);
  });
}

module.exports = { quickAuthCheck };
