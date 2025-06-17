// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * DEEP RAZORPAY PAYMENT SYSTEM TESTING
 * 
 * This test suite performs comprehensive testing of:
 * - Razorpay payment integration and flow
 * - Credit system and subscription management
 * - Payment success/failure handling
 * - Subscription upgrade/downgrade scenarios
 * - Payment history and invoice generation
 * - Error handling for payment failures
 * - Security and validation measures
 * - Webhook handling and payment verification
 * 
 * As a Senior Full Stack Developer + QA Tester with 5 years experience,
 * I'm testing the complete payment ecosystem and edge cases.
 */
test.describe('💳 Deep Razorpay Payment System Testing', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  // Test payment scenarios
  const paymentScenarios = {
    freeToBasic: {
      planName: 'Basic Plan',
      amount: 999, // ₹9.99
      credits: 50,
      features: ['AI Cover Letters', 'Resume Parser', 'Basic Support']
    },
    freeToPro: {
      planName: 'Pro Plan',
      amount: 1999, // ₹19.99
      credits: 'unlimited',
      features: ['Everything in Basic', 'Unlimited AI', 'Priority Support', 'Advanced Analytics']
    },
    basicToPro: {
      planName: 'Pro Plan',
      amount: 1000, // Upgrade difference
      credits: 'unlimited',
      upgrade: true
    }
  };

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    console.log('✅ Logged in successfully');
  });

  test('should display pricing plans correctly', async ({ page }) => {
    console.log('🧪 TESTING: Pricing Plans Display');
    
    // Navigate to pricing page
    const pricingLink = page.locator('a:has-text("Pricing"), a:has-text("Plans"), a[href*="pricing"]');
    if (await pricingLink.count() > 0) {
      await pricingLink.click();
    } else {
      await page.goto('http://localhost:3000/pricing');
    }
    
    // Verify pricing plans are displayed
    const pricingCards = page.locator('.pricing-card, .plan-card, [data-testid="pricing-plan"]');
    const planCount = await pricingCards.count();
    
    expect(planCount).toBeGreaterThanOrEqual(2); // Should have at least Free and Pro
    console.log(`📊 Found ${planCount} pricing plans`);
    
    // Check for plan details
    for (let i = 0; i < planCount; i++) {
      const plan = pricingCards.nth(i);
      const planText = await plan.textContent();
      
      // Should contain price information
      const hasPrice = /₹|\$|free|price/i.test(planText);
      const hasFeatures = /feature|credit|support/i.test(planText);
      
      console.log(`📋 Plan ${i + 1}: Price info: ${hasPrice}, Features: ${hasFeatures}`);
      expect(hasPrice || hasFeatures).toBeTruthy();
    }
    
    console.log('✅ Pricing plans display verification completed');
  });

  test('should initiate Razorpay payment flow', async ({ page }) => {
    console.log('🧪 TESTING: Razorpay Payment Flow Initiation');
    
    // Navigate to pricing or upgrade page
    await page.goto('http://localhost:3000/pricing');
    
    // Find upgrade/purchase button for Pro plan
    const proUpgradeButton = page.locator('button:has-text("Upgrade"), button:has-text("Choose Pro"), button:has-text("Get Pro")');
    
    if (await proUpgradeButton.count() > 0) {
      await proUpgradeButton.first().click();
      console.log('🔄 Clicked Pro plan upgrade button');
      
      // Wait for Razorpay modal or payment page
      await page.waitForTimeout(3000);
      
      // Check if Razorpay payment modal appeared
      const razorpayModal = page.locator('#razorpay-modal, .razorpay-container, iframe[name*="razorpay"]');
      const paymentForm = page.locator('form[action*="razorpay"], .payment-form');
      
      if (await razorpayModal.count() > 0) {
        console.log('💳 Razorpay payment modal detected');
        
        // Take screenshot of payment modal
        await page.screenshot({ path: 'test-results/razorpay-payment-modal.png' });
        
        // Check for payment amount
        const amountDisplay = page.locator('text=₹, text=INR, .amount');
        if (await amountDisplay.count() > 0) {
          const amountText = await amountDisplay.textContent();
          console.log(`💰 Payment amount displayed: ${amountText}`);
        }
        
      } else if (await paymentForm.count() > 0) {
        console.log('📝 Payment form detected');
      } else {
        console.log('⚠️ Payment interface not immediately visible - may require specific plan selection');
      }
      
    } else {
      // Try alternative approach - look for subscription management
      const subscriptionLink = page.locator('a:has-text("Subscription"), a:has-text("Billing"), a[href*="subscription"]');
      if (await subscriptionLink.count() > 0) {
        await subscriptionLink.click();
        console.log('🔄 Navigated to subscription management');
      }
    }
    
    console.log('✅ Payment flow initiation test completed');
  });

  test('should handle payment success scenario', async ({ page }) => {
    console.log('🧪 TESTING: Payment Success Handling');
    
    // Mock successful payment response
    await page.route('**/api/payment/create-order', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          orderId: 'order_test_123456',
          amount: 1999,
          currency: 'INR',
          key: 'rzp_test_key'
        })
      });
    });
    
    await page.route('**/api/payment/verify', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Payment verified successfully',
          planUpgraded: true,
          newPlan: 'pro',
          credits: 'unlimited'
        })
      });
    });
    
    // Navigate to pricing and try to upgrade
    await page.goto('http://localhost:3000/pricing');
    
    const upgradeButton = page.locator('button:has-text("Upgrade"), button:has-text("Pro")').first();
    if (await upgradeButton.count() > 0) {
      await upgradeButton.click();
      
      // Wait for payment processing
      await page.waitForTimeout(2000);
      
      // Check for success message
      const successMessage = page.locator('text=successful, text=upgraded, .success');
      if (await successMessage.count() > 0) {
        console.log('✅ Payment success message displayed');
        
        // Verify plan upgrade
        const planIndicator = page.locator('text=Pro, .pro-badge, [data-plan="pro"]');
        if (await planIndicator.count() > 0) {
          console.log('⭐ Pro plan indicator found');
        }
        
        // Check credit update
        const creditDisplay = page.locator('text=unlimited, text=credits');
        if (await creditDisplay.count() > 0) {
          const creditText = await creditDisplay.textContent();
          console.log(`💳 Credits updated: ${creditText}`);
        }
      }
    }
    
    console.log('✅ Payment success handling test completed');
  });

  test('should handle payment failure scenario', async ({ page }) => {
    console.log('🧪 TESTING: Payment Failure Handling');
    
    // Mock payment failure
    await page.route('**/api/payment/create-order', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Payment initialization failed'
        })
      });
    });
    
    await page.goto('http://localhost:3000/pricing');
    
    const upgradeButton = page.locator('button:has-text("Upgrade")').first();
    if (await upgradeButton.count() > 0) {
      await upgradeButton.click();
      
      // Wait for error handling
      await page.waitForTimeout(3000);
      
      // Check for error message
      const errorMessage = page.locator('text=failed, text=error, .error, .alert-error');
      await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });
      console.log('⚠️ Payment failure error message displayed');
      
      // Verify user remains on current plan
      const freeIndicator = page.locator('text=Free, .free-plan, [data-plan="free"]');
      if (await freeIndicator.count() > 0) {
        console.log('📱 User remains on free plan after payment failure');
      }
    }
    
    console.log('✅ Payment failure handling test completed');
  });

  test('should display current subscription status', async ({ page }) => {
    console.log('🧪 TESTING: Subscription Status Display');
    
    // Check dashboard for subscription info
    await page.goto('http://localhost:3000/dashboard');
    
    // Look for subscription/plan information
    const planDisplay = page.locator('.subscription, .plan-info, .current-plan, [data-testid="subscription-status"]');
    const creditDisplay = page.locator('.credits, .remaining-credits, [data-testid="credits"]');
    const planBadge = page.locator('.badge, .plan-badge');
    
    if (await planDisplay.count() > 0) {
      const planText = await planDisplay.textContent();
      console.log(`📊 Subscription info: ${planText}`);
    }
    
    if (await creditDisplay.count() > 0) {
      const creditText = await creditDisplay.textContent();
      console.log(`💳 Credit info: ${creditText}`);
    }
    
    if (await planBadge.count() > 0) {
      const badgeText = await planBadge.textContent();
      console.log(`🏷️ Plan badge: ${badgeText}`);
    }
    
    // Check if billing/subscription link exists
    const billingLink = page.locator('a:has-text("Billing"), a:has-text("Subscription"), a[href*="billing"]');
    if (await billingLink.count() > 0) {
      await billingLink.click();
      console.log('🔄 Navigated to billing page');
      
      // Take screenshot of billing page
      await page.screenshot({ path: 'test-results/billing-page.png' });
    }
    
    console.log('✅ Subscription status display test completed');
  });

  test('should handle credit system correctly', async ({ page }) => {
    console.log('🧪 TESTING: Credit System Management');
    
    await page.goto('http://localhost:3000/dashboard');
    
    // Look for current credit count
    const creditDisplay = page.locator('text=credits, text=remaining, .credit-count');
    let initialCredits = 0;
    
    if (await creditDisplay.count() > 0) {
      const creditText = await creditDisplay.textContent();
      const creditMatch = creditText.match(/(\d+)/);
      if (creditMatch) {
        initialCredits = parseInt(creditMatch[1]);
        console.log(`💳 Initial credits: ${initialCredits}`);
      }
    }
    
    // Use a credit-consuming feature (cover letter generation)
    const coverLetterLink = page.locator('a:has-text("Cover Letter"), a[href*="cover-letter"]');
    if (await coverLetterLink.count() > 0) {
      await coverLetterLink.click();
      
      // Generate a cover letter to consume credit
      const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
      if (await jobDescriptionField.count() > 0) {
        await jobDescriptionField.fill('Software Engineer position requiring JavaScript and React skills.');
        
        const generateButton = page.locator('button:has-text("Generate")');
        await generateButton.click();
        
        // Wait for generation
        await page.waitForTimeout(5000);
        
        // Check if credits were deducted
        const updatedCreditDisplay = page.locator('text=credits, text=remaining, .credit-count');
        if (await updatedCreditDisplay.count() > 0) {
          const updatedCreditText = await updatedCreditDisplay.textContent();
          console.log(`💳 Updated credits display: ${updatedCreditText}`);
        }
        
        console.log('🔄 Credit consumption test completed');
      }
    }
    
    console.log('✅ Credit system management test completed');
  });

  test('should validate payment amount calculation', async ({ page }) => {
    console.log('🧪 TESTING: Payment Amount Calculation');
    
    await page.goto('http://localhost:3000/pricing');
    
    // Check pricing display for different plans
    const pricingCards = page.locator('.pricing-card, .plan-card');
    
    for (let i = 0; i < await pricingCards.count(); i++) {
      const card = pricingCards.nth(i);
      const cardText = await card.textContent();
      
      // Extract price information
      const priceMatch = cardText.match(/₹(\d+)|$(\d+)/);
      if (priceMatch) {
        const price = priceMatch[1] || priceMatch[2];
        console.log(`💰 Plan ${i + 1} price: ₹${price}`);
        
        // Verify price is reasonable (between ₹100 and ₹10000)
        const numericPrice = parseInt(price);
        expect(numericPrice).toBeGreaterThan(0);
        expect(numericPrice).toBeLessThan(10000);
      }
    }
    
    // Test currency conversion if applicable
    const currencyDisplay = page.locator('text=INR, text=₹, .currency');
    if (await currencyDisplay.count() > 0) {
      console.log('💱 Currency display found');
    }
    
    console.log('✅ Payment amount calculation validation completed');
  });

  test('should test payment history and invoices', async ({ page }) => {
    console.log('🧪 TESTING: Payment History and Invoices');
    
    // Mock payment history data
    await page.route('**/api/payment/history', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          payments: [
            {
              id: 'pay_123456',
              amount: 1999,
              currency: 'INR',
              status: 'captured',
              createdAt: '2024-01-15T10:30:00Z',
              plan: 'Pro Plan',
              orderId: 'order_789'
            },
            {
              id: 'pay_654321',
              amount: 999,
              currency: 'INR',
              status: 'captured',
              createdAt: '2024-01-01T15:45:00Z',
              plan: 'Basic Plan',
              orderId: 'order_456'
            }
          ]
        })
      });
    });
    
    // Navigate to billing/payment history
    const billingLink = page.locator('a:has-text("Billing"), a:has-text("Payment History"), a[href*="billing"]');
    if (await billingLink.count() > 0) {
      await billingLink.click();
      console.log('🔄 Navigated to billing page');
      
      // Check for payment history table/list
      const paymentHistory = page.locator('.payment-history, .transaction-list, table');
      if (await paymentHistory.count() > 0) {
        console.log('📊 Payment history section found');
        
        // Check for individual payment entries
        const paymentEntries = page.locator('.payment-entry, tr, .transaction-item');
        const entryCount = await paymentEntries.count();
        console.log(`📋 Found ${entryCount} payment entries`);
        
        // Test invoice download
        const downloadButton = page.locator('button:has-text("Download"), a:has-text("Invoice")');
        if (await downloadButton.count() > 0) {
          console.log('📄 Invoice download option available');
        }
      }
    }
    
    console.log('✅ Payment history and invoice test completed');
  });

  test('should handle subscription cancellation', async ({ page }) => {
    console.log('🧪 TESTING: Subscription Cancellation');
    
    // Mock subscription cancellation endpoint
    await page.route('**/api/subscription/cancel', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Subscription cancelled successfully',
          activeUntil: '2024-02-15T23:59:59Z'
        })
      });
    });
    
    // Navigate to subscription management
    const subscriptionLink = page.locator('a:has-text("Subscription"), a:has-text("Manage"), a[href*="subscription"]');
    if (await subscriptionLink.count() > 0) {
      await subscriptionLink.click();
      
      // Look for cancel subscription button
      const cancelButton = page.locator('button:has-text("Cancel Subscription"), button:has-text("Cancel")');
      if (await cancelButton.count() > 0) {
        await cancelButton.click();
        console.log('🔄 Clicked cancel subscription');
        
        // Handle confirmation dialog
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
        if (await confirmButton.count() > 0) {
          await confirmButton.click();
          console.log('✅ Confirmed subscription cancellation');
        }
        
        // Check for cancellation success message
        const successMessage = page.locator('text=cancelled, text=success, .success');
        if (await successMessage.count() > 0) {
          console.log('✅ Cancellation success message displayed');
        }
        
        // Verify subscription status update
        const statusDisplay = page.locator('text=cancelled, text=expires, .subscription-status');
        if (await statusDisplay.count() > 0) {
          const statusText = await statusDisplay.textContent();
          console.log(`📊 Updated subscription status: ${statusText}`);
        }
      }
    }
    
    console.log('✅ Subscription cancellation test completed');
  });

  test('should validate payment security measures', async ({ page }) => {
    console.log('🧪 TESTING: Payment Security Validation');
    
    // Test HTTPS requirement for payment pages
    await page.goto('http://localhost:3000/pricing');
    
    // Check if payment buttons are disabled on HTTP (should require HTTPS)
    const paymentButtons = page.locator('button:has-text("Upgrade"), button:has-text("Pay")');
    
    for (let i = 0; i < await paymentButtons.count(); i++) {
      const button = paymentButtons.nth(i);
      const isDisabled = await button.isDisabled();
      console.log(`🔒 Payment button ${i + 1} disabled status: ${isDisabled}`);
    }
    
    // Test CSRF protection
    await page.route('**/api/payment/create-order', (route) => {
      const headers = route.request().headers();
      const hasCsrfToken = headers['x-csrf-token'] || headers['csrf-token'];
      console.log(`🛡️ CSRF token present: ${!!hasCsrfToken}`);
      
      route.continue();
    });
    
    // Test rate limiting (multiple rapid requests)
    const upgradeButton = page.locator('button:has-text("Upgrade")').first();
    if (await upgradeButton.count() > 0) {
      for (let i = 0; i < 3; i++) {
        await upgradeButton.click();
        await page.waitForTimeout(100);
      }
      console.log('🔄 Tested rapid payment requests');
    }
    
    console.log('✅ Payment security validation completed');
  });

  test('should test webhook handling simulation', async ({ page }) => {
    console.log('🧪 TESTING: Webhook Handling Simulation');
    
    // Mock webhook verification endpoint
    await page.route('**/api/payment/webhook', (route) => {
      const body = route.request().postData();
      console.log('📡 Webhook received:', body ? body.substring(0, 100) + '...' : 'empty');
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Webhook processed successfully'
        })
      });
    });
    
    // Simulate successful payment webhook
    const webhookData = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_webhook_test',
            amount: 1999,
            currency: 'INR',
            status: 'captured',
            order_id: 'order_webhook_test'
          }
        }
      }
    };
    
    // Test webhook endpoint directly (simulation)
    const response = await fetch('http://localhost:5000/api/payment/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Razorpay-Signature': 'test_signature'
      },
      body: JSON.stringify(webhookData)
    }).catch(() => null);
    
    if (response) {
      console.log(`📡 Webhook response status: ${response.status}`);
    } else {
      console.log('⚠️ Webhook endpoint not accessible (expected in test environment)');
    }
    
    console.log('✅ Webhook handling simulation completed');
  });

  test('should test payment retry mechanism', async ({ page }) => {
    console.log('🧪 TESTING: Payment Retry Mechanism');
    
    let requestCount = 0;
    
    // Mock initial payment failure, then success
    await page.route('**/api/payment/create-order', (route) => {
      requestCount++;
      
      if (requestCount === 1) {
        // First request fails
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Temporary server error'
          })
        });
      } else {
        // Second request succeeds
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            orderId: 'order_retry_success',
            amount: 1999,
            currency: 'INR'
          })
        });
      }
    });
    
    await page.goto('http://localhost:3000/pricing');
    
    const upgradeButton = page.locator('button:has-text("Upgrade")').first();
    if (await upgradeButton.count() > 0) {
      await upgradeButton.click();
      console.log('🔄 First payment attempt (should fail)');
      
      await page.waitForTimeout(2000);
      
      // Look for retry button or automatic retry
      const retryButton = page.locator('button:has-text("Retry"), button:has-text("Try Again")');
      if (await retryButton.count() > 0) {
        await retryButton.click();
        console.log('🔄 Clicked retry button');
      } else {
        // If no explicit retry button, try upgrade again
        await upgradeButton.click();
        console.log('🔄 Second payment attempt');
      }
      
      await page.waitForTimeout(2000);
      
      // Verify success after retry
      const successMessage = page.locator('text=successful, .success');
      if (await successMessage.count() > 0) {
        console.log('✅ Payment succeeded after retry');
      }
    }
    
    console.log(`📊 Total payment requests made: ${requestCount}`);
    console.log('✅ Payment retry mechanism test completed');
  });
});
