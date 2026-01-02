import { test, expect } from '@playwright/test';

test.describe('Font Size Slider Accessibility Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear());
  });

  test('should display font size slider with default value', async ({ page }) => {
    await page.goto('/');
    
    // Check that the font size slider is visible
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    await expect(slider).toBeVisible();
    
    // Check default value is 16
    await expect(slider).toHaveValue('16');
    
    // Check the label is visible
    await expect(page.getByText('Font Size')).toBeVisible();
    
    // Check the font size value display
    await expect(page.getByText('16px')).toBeVisible();
  });

  test('should adjust font size when slider is moved', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Move slider to a higher value
    await slider.fill('20');
    
    // Check the value updated
    await expect(slider).toHaveValue('20');
    await expect(page.getByText('20px')).toBeVisible();
    
    // Check that CSS variable was updated
    const fontSize = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--base-font-size');
    });
    expect(fontSize.trim()).toBe('20px');
  });

  test('should show reset button when font size is changed', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Initially, reset button should not be visible
    await expect(page.getByRole('button', { name: /reset font size/i })).not.toBeVisible();
    
    // Change font size
    await slider.fill('18');
    
    // Reset button should now be visible
    const resetButton = page.getByRole('button', { name: /reset font size/i });
    await expect(resetButton).toBeVisible();
  });

  test('should reset font size to default when reset button is clicked', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Change font size
    await slider.fill('22');
    await expect(slider).toHaveValue('22');
    
    // Click reset button
    const resetButton = page.getByRole('button', { name: /reset font size/i });
    await resetButton.click();
    
    // Check value reset to 16
    await expect(slider).toHaveValue('16');
    await expect(page.getByText('16px')).toBeVisible();
    
    // Reset button should disappear
    await expect(resetButton).not.toBeVisible();
  });

  test('should support keyboard navigation with arrow keys', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Focus the slider
    await slider.focus();
    
    // Press right arrow key to increase
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue('17');
    
    // Press left arrow key to decrease
    await page.keyboard.press('ArrowLeft');
    await expect(slider).toHaveValue('16');
  });

  test('should support keyboard navigation with Home and End keys', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Focus the slider
    await slider.focus();
    
    // Press End key to go to maximum
    await page.keyboard.press('End');
    await expect(slider).toHaveValue('24');
    await expect(page.getByText('24px')).toBeVisible();
    
    // Press Home key to go to minimum
    await page.keyboard.press('Home');
    await expect(slider).toHaveValue('12');
    await expect(page.getByText('12px')).toBeVisible();
  });

  test('should persist font size preference in localStorage', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Change font size
    await slider.fill('20');
    
    // Check localStorage
    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('user-font-size-preference');
    });
    expect(storedValue).toBe('20');
    
    // Reload page
    await page.reload();
    
    // Check that font size is still 20
    const reloadedSlider = page.getByRole('slider', { name: /adjust font size/i });
    await expect(reloadedSlider).toHaveValue('20');
    await expect(page.getByText('20px')).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Check ARIA attributes
    await expect(slider).toHaveAttribute('aria-valuemin', '12');
    await expect(slider).toHaveAttribute('aria-valuemax', '24');
    await expect(slider).toHaveAttribute('aria-valuenow', '16');
    await expect(slider).toHaveAttribute('aria-valuetext', '16 pixels');
  });

  test('should update ARIA attributes when value changes', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Change value
    await slider.fill('20');
    
    // Check updated ARIA attributes
    await expect(slider).toHaveAttribute('aria-valuenow', '20');
    await expect(slider).toHaveAttribute('aria-valuetext', '20 pixels');
  });

  test('should respect min and max boundaries', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Set to minimum
    await slider.fill('12');
    await expect(slider).toHaveValue('12');
    
    // Set to maximum
    await slider.fill('24');
    await expect(slider).toHaveValue('24');
    
    // Verify we can't go beyond via keyboard
    await slider.focus();
    await page.keyboard.press('End'); // Go to max
    await expect(slider).toHaveValue('24');
    await page.keyboard.press('ArrowRight'); // Try to go beyond max
    await expect(slider).toHaveValue('24'); // Should stay at max
    
    await page.keyboard.press('Home'); // Go to min
    await expect(slider).toHaveValue('12');
    await page.keyboard.press('ArrowLeft'); // Try to go beyond min
    await expect(slider).toHaveValue('12'); // Should stay at min
  });

  test('should be accessible with keyboard focus', async ({ page }) => {
    // Focus on sign-in button first
    const signInButton = page.getByRole('button', { name: /sign in with microsoft/i });
    await signInButton.focus();
    
    // Tab to the slider (it should be the next focusable element after heading)
    await page.keyboard.press('Tab'); // Skip heading and move to slider
    
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    
    // Wait a moment for focus to settle
    await page.waitForTimeout(100);
    
    // Check slider is focused or can be focused
    const isFocused = await slider.evaluate((el) => document.activeElement === el);
    if (!isFocused) {
      await slider.focus();
    }
    
    // Verify we can interact with keyboard
    const initialValue = await slider.inputValue();
    await page.keyboard.press('ArrowRight');
    const newValue = await slider.inputValue();
    
    // Value should have changed
    expect(parseInt(newValue)).toBe(parseInt(initialValue) + 1);
  });

  test('should visually indicate size change with A indicators', async ({ page }) => {
    // Check that size indicators are present
    const container = page.locator('.font-size-slider-container');
    await expect(container).toBeVisible();
    
    // The small and large A indicators should be visible
    const sizeIndicators = page.locator('.size-indicator');
    await expect(sizeIndicators).toHaveCount(2);
  });

  test('should affect actual text size on the page', async ({ page }) => {
    const title = page.getByRole('heading', { name: /multi-language greeting app/i });
    
    // Get initial computed font size
    const initialSize = await title.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    
    // Change slider value
    const slider = page.getByRole('slider', { name: /adjust font size/i });
    await slider.fill('20');
    
    // Get new computed font size
    const newSize = await title.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    
    // New size should be larger than initial size
    expect(parseFloat(newSize)).toBeGreaterThan(parseFloat(initialSize));
  });
});
