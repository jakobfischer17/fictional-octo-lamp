# Multi-Language Greeting App

A simple and elegant React.js SPA (Single Page Application) that allows you to greet people in multiple languages! 🌍

## 🚀 Live Demo

**[View Live Application](https://red-dune-06de1fe03.3.azurestaticapps.net)** - Deployed on Azure Static Web Apps

![Multi-Language Greeting App](https://github.com/user-attachments/assets/05ba2a1c-1f47-4f10-baf5-8ceed9e4033a)

## Features

- 🔐 **Azure EntraID Authentication**: Secure sign-in with Microsoft accounts using PKCE flow
- 👤 **User Profile Display**: View your Microsoft account information after authentication
- 🌐 **12 Languages Supported**: English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Korean, Arabic, Russian, and Hindi
- 🎯 **Personalized Greetings**: Enter a name or use your authenticated account name for greetings
- 🎨 **Beautiful UI**: Modern, responsive design with gradient backgrounds
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance
- 🧪 **Tested**: Comprehensive Playwright test suite included

## Screenshots

### Default View
![Default greeting in English](https://github.com/user-attachments/assets/05ba2a1c-1f47-4f10-baf5-8ceed9e4033a)

### Greeting with Name
![Japanese greeting with name](https://github.com/user-attachments/assets/dfefb475-567d-4add-9ab6-21e7cb71fd0f)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jakobfischer17/fictional-octo-lamp.git
cd fictional-octo-lamp
```

2. Install dependencies:
```bash
npm install
```

3. Set up Azure EntraID authentication:
   - Run the Azure setup script: `.\azure-setup.ps1`
   - Or follow the manual steps in [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md)
   - Update `.env` with your Azure credentials

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Testing

Run the Playwright test suite:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

### Build for Production

Create a production build:
```bash
npm run build
```

The optimized files will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Deployment

This application is deployed on **Azure Static Web Apps** and is available at:
**https://red-dune-06de1fe03.3.azurestaticapps.net**

### Deploy Your Own Instance

#### Azure Static Web Apps (Recommended)
```bash
# Create resource group
az group create --name rg-fictional-octo-lamp --location westeurope

# Register provider (if needed)
az provider register --namespace Microsoft.Web

# Create Static Web App
az staticwebapp create --name your-app-name --resource-group rg-fictional-octo-lamp --location westeurope --sku Free

# Deploy
npm run build
swa deploy ./dist --env production
```

See [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) for complete deployment instructions.

#### Other Deployment Options

The built application is a static site that can be deployed to any static hosting service:

### Deploy to Netlify
1. Build the app: `npm run build`
2. Deploy the `dist/` folder to Netlify

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to GitHub Pages
1. Build the app: `npm run build`
2. Deploy the `dist/` folder to GitHub Pages

### Deploy to Any Static Host
Simply upload the contents of the `dist/` folder to your hosting provider.

## Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Next-generation frontend build tool
- **Azure MSAL**: Microsoft Authentication Library for browser (PKCE flow)
- **Microsoft Graph API**: User profile data integration
- **Playwright**: End-to-end testing framework
- **Azure Static Web Apps**: Cloud hosting platform
- **CSS3**: Custom styling with gradients and animations

## Project Structure

```
fictional-octo-lamp/
├── src/
│   ├── components/
│   │   ├── SignInButton.jsx    # Authentication sign-in component
│   │   ├── SignOutButton.jsx   # Authentication sign-out component
│   │   ├── UserProfile.jsx     # User profile display component
│   │   └── UserProfile.css     # Profile component styles
│   ├── authConfig.js            # MSAL authentication configuration
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Application styles
│   ├── main.jsx                 # Entry point with MSAL provider
│   └── index.css                # Global styles
├── tests/
│   └── auth.spec.js             # Playwright test suite
├── azure-setup.ps1              # Azure app registration automation
├── azure-continue-setup.ps1     # Setup recovery script
├── playwright.config.js         # Playwright configuration
├── .env.template                # Environment variables template
├── .env.production              # Production environment config
├── AUTHENTICATION_SETUP.md      # Authentication setup guide
├── TESTING_AND_PROFILE.md       # Testing documentation
├── index.html                   # HTML template
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## How It Works

The app uses React state management and Azure EntraID authentication to:
1. Authenticate users with Microsoft accounts using PKCE flow (no client secret)
2. Fetch user profile data from Microsoft Graph API
3. Track the selected language
4. Store the user's name (manual input or from authenticated profile)
5. Display the appropriate greeting based on the selected language

The greeting updates instantly when you select a different language, and authenticated users see their Microsoft account name automatically filled in.

### Security Features
- ✅ PKCE flow for secure authentication
- ✅ Session-based token storage
- ✅ No client secrets in code
- ✅ Environment variables for configuration
- ✅ Automatic token refresh

## Supported Languages

| Language | Greeting |
|----------|----------|
| English | Hello |
| Spanish | Hola |
| French | Bonjour |
| German | Guten Tag |
| Italian | Ciao |
| Portuguese | Olá |
| Japanese | こんにちは |
| Chinese | 你好 |
| Korean | 안녕하세요 |
| Arabic | مرحبا |
| Russian | Привет |
| Hindi | नमस्ते |

## Documentation

- **[AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md)** - Complete guide for setting up Azure EntraID authentication
- **[TESTING_AND_PROFILE.md](TESTING_AND_PROFILE.md)** - Playwright testing and user profile documentation

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.