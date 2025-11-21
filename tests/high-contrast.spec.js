import { test, expect } from '@playwright/test';

test.describe('High Contrast Mode for Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display high contrast toggle button', async ({ page }) => {
    await page.goto('/');
    
    // Check that the high contrast toggle is visible
    const toggleLabel = page.getByText('High Contrast');
    await expect(toggleLabel).toBeVisible();
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    await expect(toggleSwitch).toBeVisible();
  });

  test('should toggle high contrast mode on click', async ({ page }) => {
    await page.goto('/');
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    
    // Initially should not be pressed
    await expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false');
    
    // Click to activate high contrast mode
    await toggleSwitch.click();
    
    // Should now be pressed
    await expect(toggleSwitch).toHaveAttribute('aria-pressed', 'true');
    
    // Body should have high-contrast class
    const body = page.locator('body');
    await expect(body).toHaveClass(/high-contrast/);
    
    // Click again to deactivate
    await toggleSwitch.click();
    
    // Should not be pressed
    await expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false');
    
    // Body should not have high-contrast class
    await expect(body).not.toHaveClass(/high-contrast/);
  });

  test('should persist high contrast preference in localStorage', async ({ page }) => {
    await page.goto('/');
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    
    // Activate high contrast mode
    await toggleSwitch.click();
    
    // Check localStorage
    const storedValue = await page.evaluate(() => localStorage.getItem('highContrastMode'));
    expect(storedValue).toBe('true');
    
    // Reload page
    await page.reload();
    
    // High contrast mode should still be active
    const body = page.locator('body');
    await expect(body).toHaveClass(/high-contrast/);
    await expect(toggleSwitch).toHaveAttribute('aria-pressed', 'true');
  });

  test('should restore high contrast preference on page load', async ({ page }) => {
    // Set high contrast mode in localStorage before loading page
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('highContrastMode', 'true'));
    await page.reload();
    
    // Body should have high-contrast class on load
    const body = page.locator('body');
    await expect(body).toHaveClass(/high-contrast/);
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    await expect(toggleSwitch).toHaveAttribute('aria-pressed', 'true');
  });

  test('should have proper ARIA attributes for accessibility', async ({ page }) => {
    await page.goto('/');
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    
    // Check ARIA attributes
    await expect(toggleSwitch).toHaveAttribute('role', 'switch');
    await expect(toggleSwitch).toHaveAttribute('aria-label', 'Toggle high contrast mode');
    await expect(toggleSwitch).toHaveAttribute('aria-pressed');
  });

  test('should apply high contrast styles to all UI elements', async ({ page }) => {
    await page.goto('/');
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    await toggleSwitch.click();
    
    // Wait for styles to be applied
    await page.waitForTimeout(100);
    
    // Check that body has high-contrast class
    const body = page.locator('body');
    await expect(body).toHaveClass(/high-contrast/);
    
    // Verify high contrast styles are applied by checking background color
    const bodyBgColor = await body.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // In high contrast mode, body should have black background (rgb(0, 0, 0))
    expect(bodyBgColor).toBe('rgb(0, 0, 0)');
  });

  test('should maintain high contrast mode across language changes', async ({ page }) => {
    await page.goto('/');
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    await toggleSwitch.click();
    
    // Change language
    await page.getByRole('button', { name: 'Spanish' }).click();
    
    // High contrast should still be active
    const body = page.locator('body');
    await expect(body).toHaveClass(/high-contrast/);
    
    // Verify greeting changed and high contrast is still on
    await expect(page.locator('.greeting-text')).toContainText('Hola');
  });

  test('should work with name input in high contrast mode', async ({ page }) => {
    await page.goto('/');
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    await toggleSwitch.click();
    
    // Enter a name
    const nameInput = page.getByLabel(/enter your name/i);
    await nameInput.fill('John Doe');
    
    // Verify the name appears in the greeting with high contrast active
    await expect(page.locator('.greeting-text')).toContainText('John Doe');
    
    // High contrast should still be active
    const body = page.locator('body');
    await expect(body).toHaveClass(/high-contrast/);
  });

  test('should have accessible toggle with keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    
    // Focus the toggle button
    await toggleSwitch.focus();
    
    // Verify it's focused
    await expect(toggleSwitch).toBeFocused();
    
    // Press Space to toggle
    await page.keyboard.press('Space');
    
    // Should be activated
    await expect(toggleSwitch).toHaveAttribute('aria-pressed', 'true');
    
    const body = page.locator('body');
    await expect(body).toHaveClass(/high-contrast/);
  });

  test('should have sufficient contrast ratios in high contrast mode', async ({ page }) => {
    await page.goto('/');
    
    const toggleSwitch = page.getByRole('switch', { name: /toggle high contrast mode/i });
    await toggleSwitch.click();
    
    // Wait for styles to be applied
    await page.waitForTimeout(100);
    
    // Check container has proper border and background
    const container = page.locator('.container');
    const containerStyles = await container.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        borderWidth: styles.borderWidth
      };
    });
    
    // Black background
    expect(containerStyles.backgroundColor).toBe('rgb(0, 0, 0)');
    // White border (rgb(255, 255, 255))
    expect(containerStyles.borderColor).toBe('rgb(255, 255, 255)');
    // Has visible border
    expect(containerStyles.borderWidth).toBe('3px');
  });
});
