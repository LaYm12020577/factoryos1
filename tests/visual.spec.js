import { test, expect } from '@playwright/test';

test.describe('FactoryOS Visual & Functional Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Default lang is Uzbek
  });

  test('Desktop - Navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Check if sidebar nav exists
    const nav = page.locator('aside');
    await expect(nav).toBeVisible();

    // Take screenshot of dashboard (Uzbek)
    await page.screenshot({ path: 'screenshots/desktop-dashboard-uz.png' });

    // Switch to language menu and change to English
    // Look for button with Globe icon
    await page.locator('header button').filter({ has: page.locator('svg.lucide-globe') }).click();
    await page.click('text=English');
    
    // Verify Dashboard text in English
    await expect(page.locator('h2')).toContainText('Dashboard');
    await page.screenshot({ path: 'screenshots/desktop-dashboard-en.png' });

    // Click Orders in sidebar
    await page.click('aside >> text=Orders');
    await expect(page.locator('h2')).toContainText('Orders');
    await page.screenshot({ path: 'screenshots/desktop-orders-en.png' });
  });

  test('Functional - New Order Modal', async ({ page }) => {
    // Switch to English first for easier selection
    await page.locator('header button').filter({ has: page.locator('svg.lucide-globe') }).click();
    await page.click('text=English');

    await page.click('aside >> text=Orders');
    await page.click('text=New Order');
    
    const modal = page.locator('.bg-white\\/90'); // Modal class
    await expect(modal).toBeVisible();
    await expect(modal.locator('h2')).toContainText('New Order');
    
    await page.screenshot({ path: 'screenshots/modal-new-order.png' });
  });
});
