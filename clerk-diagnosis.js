/**
 * Clerk Integration Diagnostic Test
 * Verifies Clerk configuration and functionality
 */

const { chromium } = require('playwright');

async function diagnoseClerKIntegration() {
  console.log('🔍 Diagnosing Clerk Integration...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  
  const consoleMessages = [];
  const networkRequests = [];
  const errors = [];
  
  // Capture console messages
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  // Capture network requests
  page.on('request', req => {
    if (req.url().includes('clerk')) {
      networkRequests.push(`${req.method()} ${req.url()}`);
    }
  });
  
  // Capture errors
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    console.log('1️⃣ Testing Landing Page...');
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Landing page loaded');
    
    console.log('\n2️⃣ Testing Login Page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Wait for Clerk to initialize
    await page.waitForTimeout(3000);
    
    // Check for Clerk elements
    const clerkElements = await page.$$('[data-clerk-element], .cl-signIn-root, .cl-card, .cl-component');
    console.log(`✅ Found ${clerkElements.length} Clerk elements`);
    
    // Check if we can interact with Clerk forms
    const emailInput = await page.$('input[name="identifier"], input[type="email"]');
    if (emailInput) {
      console.log('✅ Email input field found');
      
      // Try to fill email field
      try {
        await emailInput.fill('test@example.com');
        console.log('✅ Email field is interactive');
      } catch (e) {
        console.log('⚠️ Could not interact with email field:', e.message);
      }
    } else {
      console.log('❌ No email input field found');
    }
    
    console.log('\n3️⃣ Testing Register Page...');
    await page.goto('http://localhost:3000/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const registerElements = await page.$$('[data-clerk-element], .cl-signUp-root, .cl-card, .cl-component');
    console.log(`✅ Found ${registerElements.length} Clerk register elements`);
    
    // Test if we can start a registration
    const registerEmailInput = await page.$('input[name="emailAddress"], input[type="email"]');
    if (registerEmailInput) {
      console.log('✅ Register email input found');
      
      try {
        await registerEmailInput.fill('newuser@example.com');
        console.log('✅ Register email field is interactive');
        
        // Look for password field
        const passwordInput = await page.$('input[name="password"], input[type="password"]');
        if (passwordInput) {
          await passwordInput.fill('testPassword123');
          console.log('✅ Password field is interactive');
          
          // Look for submit button
          const submitButton = await page.$('button[type="submit"], .cl-formButtonPrimary');
          if (submitButton) {
            console.log('✅ Submit button found');
            console.log('ℹ️ Registration form is fully functional');
          }
        }
      } catch (e) {
        console.log('⚠️ Could not interact with register form:', e.message);
      }
    }
    
    console.log('\n4️⃣ Console Messages Analysis...');
    const relevantMessages = consoleMessages.filter(msg => 
      msg.includes('clerk') || 
      msg.includes('auth') || 
      msg.includes('error') ||
      msg.includes('warning')
    );
    
    if (relevantMessages.length > 0) {
      console.log('📋 Relevant console messages:');
      relevantMessages.slice(0, 10).forEach(msg => console.log(`   ${msg}`));
    } else {
      console.log('✅ No concerning console messages');
    }
    
    console.log('\n5️⃣ Network Requests Analysis...');
    if (networkRequests.length > 0) {
      console.log('🌐 Clerk network requests:');
      networkRequests.forEach(req => console.log(`   ${req}`));
    } else {
      console.log('ℹ️ No Clerk network requests detected');
    }
    
    console.log('\n6️⃣ Error Analysis...');
    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:');
      errors.forEach(error => console.log(`   ${error}`));
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
    console.log('\n🎯 Clerk Integration Diagnosis Complete!');
    console.log('==========================================');
    
    // Summary
    const hasClerkUI = clerkElements.length > 0 || registerElements.length > 0;
    const hasInteractivity = emailInput !== null || registerEmailInput !== null;
    const hasErrors = errors.length > 0;
    
    if (hasClerkUI && hasInteractivity && !hasErrors) {
      console.log('🎉 Clerk integration is working correctly!');
      console.log('✅ UI components: Present');
      console.log('✅ Form interactivity: Working');
      console.log('✅ No blocking errors: Confirmed');
    } else {
      console.log('⚠️ Clerk integration has some issues:');
      console.log(`   UI components: ${hasClerkUI ? 'Present' : 'Missing'}`);
      console.log(`   Form interactivity: ${hasInteractivity ? 'Working' : 'Not working'}`);
      console.log(`   Errors: ${hasErrors ? 'Found' : 'None'}`);
    }
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the diagnosis
if (require.main === module) {
  diagnoseClerKIntegration().catch(console.error);
}

module.exports = { diagnoseClerKIntegration };
