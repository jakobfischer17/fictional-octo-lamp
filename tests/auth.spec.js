import { test, expect } from '@playwright/test';

test.describe('Azure EntraID Authentication Flow', () => {
  test('should display sign-in button when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Check that the sign-in button is visible
    const signInButton = page.getByRole('button', { name: /sign in with microsoft/i });
    await expect(signInButton).toBeVisible();
    
    // Check that the app title is visible
    await expect(page.getByRole('heading', { name: /multi-language greeting app/i })).toBeVisible();
  });

  test('should show authentication UI elements', async ({ page }) => {
    await page.goto('/');
    
    // Verify the auth section exists
    const authSection = page.locator('.auth-section');
    await expect(authSection).toBeVisible();
    
    // Verify sign-in button has correct styling
    const signInButton = page.getByRole('button', { name: /sign in with microsoft/i });
    await expect(signInButton).toHaveClass(/sign-in/);
  });

  test('should have proper page structure', async ({ page }) => {
    await page.goto('/');
    
    // Check main app structure
    await expect(page.locator('.app')).toBeVisible();
    await expect(page.locator('.container')).toBeVisible();
    
    // Check greeting app elements
    await expect(page.getByText(/greet people in different languages/i)).toBeVisible();
    await expect(page.getByLabel(/enter your name/i)).toBeVisible();
    await expect(page.getByText(/choose a language/i)).toBeVisible();
    
    // Check language buttons are present
    const languageButtons = page.locator('.language-button');
    await expect(languageButtons).toHaveCount(12); // 12 languages
  });

  test('should interact with language selection', async ({ page }) => {
    await page.goto('/');
    
    // Click on Spanish language
    await page.getByRole('button', { name: 'Spanish' }).click();
    
    // Verify the greeting changes to Spanish
    await expect(page.locator('.greeting-text')).toContainText('Hola');
    
    // Click on French language
    await page.getByRole('button', { name: 'French' }).click();
    
    // Verify the greeting changes to French
    await expect(page.locator('.greeting-text')).toContainText('Bonjour');
  });

  test('should allow manual name input', async ({ page }) => {
    await page.goto('/');
    
    // Enter a name
    const nameInput = page.getByLabel(/enter your name/i);
    await nameInput.fill('John Doe');
    
    // Verify the name appears in the greeting
    await expect(page.locator('.greeting-text')).toContainText('John Doe');
  });

  // Note: Actual authentication testing requires real credentials and is typically done in E2E tests
  // This is a placeholder for when you want to add authenticated state tests
  test.skip('should complete authentication flow', async ({ page }) => {
    await page.goto('/');
    
    // Click sign-in button
    const signInButton = page.getByRole('button', { name: /sign in with microsoft/i });
    await signInButton.click();
    
    // Note: This would require handling the Microsoft login popup/redirect
    // and providing test credentials, which is beyond basic Playwright setup
    
    // After authentication, check for sign-out button
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
    
    // Check for user welcome message
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should have accessible form elements', async ({ page }) => {
    await page.goto('/');
    
    // Check accessibility of form elements
    const nameInput = page.getByLabel(/enter your name/i);
    await expect(nameInput).toHaveAttribute('id', 'name-input');
    await expect(nameInput).toHaveAttribute('placeholder', 'Your name');
  });
});
