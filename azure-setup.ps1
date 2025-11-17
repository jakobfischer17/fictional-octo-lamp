# Azure EntraID App Registration Setup Script
# This script creates an Azure AD app registration for the fictional-octo-lamp SPA

Write-Host "Creating Azure AD App Registration for fictional-octo-lamp..." -ForegroundColor Cyan

# Step 1: Create the app registration
Write-Host "`nStep 1: Creating app registration..." -ForegroundColor Yellow
$clientId = az ad app create --display-name "fictional-octo-lamp-spa" --query appId --output tsv

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error creating app registration" -ForegroundColor Red
    exit 1
}

Write-Host "App created successfully. Client ID: $clientId" -ForegroundColor Green

# Step 2: Configure SPA platform with redirect URI
Write-Host "`nStep 2: Configuring SPA platform with redirect URI..." -ForegroundColor Yellow
az ad app update --id $clientId --set spa.redirectUris="['http://localhost:5173']"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error configuring redirect URI" -ForegroundColor Red
    exit 1
}

Write-Host "Redirect URI configured successfully" -ForegroundColor Green

# Step 3: Add Microsoft Graph User.Read permission
Write-Host "`nStep 3: Adding Microsoft Graph User.Read API permission..." -ForegroundColor Yellow
# Microsoft Graph API ID: 00000003-0000-0000-c000-000000000000
# User.Read permission ID: e1fe6dd8-ba31-4d61-89e7-88639da4683d
az ad app permission add --id $clientId --api 00000003-0000-0000-c000-000000000000 --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error adding API permission" -ForegroundColor Red
    exit 1
}

Write-Host "API permission added successfully" -ForegroundColor Green

# Step 4: Grant admin consent (requires admin privileges)
Write-Host "`nStep 4: Granting admin consent..." -ForegroundColor Yellow
az ad app permission admin-consent --id $clientId

if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Could not grant admin consent. You may need admin privileges." -ForegroundColor Yellow
    Write-Host "You can grant consent manually in the Azure Portal." -ForegroundColor Yellow
} else {
    Write-Host "Admin consent granted successfully" -ForegroundColor Green
}

# Step 5: Get tenant ID
Write-Host "`nStep 5: Getting tenant ID..." -ForegroundColor Yellow
$tenantId = az account show --query tenantId --output tsv

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error getting tenant ID" -ForegroundColor Red
    exit 1
}

Write-Host "Tenant ID: $tenantId" -ForegroundColor Green

# Display summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Azure AD App Registration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nConfiguration Details:" -ForegroundColor Cyan
Write-Host "App Name: fictional-octo-lamp-spa" -ForegroundColor White
Write-Host "Client ID: $clientId" -ForegroundColor White
Write-Host "Tenant ID: $tenantId" -ForegroundColor White
Write-Host "Redirect URI: http://localhost:5173" -ForegroundColor White
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Update your .env file with the Client ID and Tenant ID above" -ForegroundColor Yellow
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor Yellow
Write-Host "3. Navigate to http://localhost:5173 and test authentication" -ForegroundColor Yellow
Write-Host "`n========================================" -ForegroundColor Cyan

# Optionally update .env file automatically
$updateEnv = Read-Host "`nWould you like to automatically update the .env file? (y/n)"
if ($updateEnv -eq 'y' -or $updateEnv -eq 'Y') {
    $envContent = @"
# Azure EntraID Configuration
VITE_AZURE_CLIENT_ID=$clientId
VITE_AZURE_TENANT_ID=$tenantId
VITE_AZURE_REDIRECT_URI=http://localhost:5173
"@
    $envContent | Set-Content -Path ".env"
    Write-Host ".env file updated successfully!" -ForegroundColor Green
}
