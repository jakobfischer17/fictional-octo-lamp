# Multi-Language Greeting App

A simple and elegant React.js SPA (Single Page Application) that allows you to greet people in multiple languages! 🌍

**Now with secure authentication using Microsoft EntraID (Azure Active Directory) with PKCE!** 🔐

![Multi-Language Greeting App](https://github.com/user-attachments/assets/05ba2a1c-1f47-4f10-baf5-8ceed9e4033a)

## Features

- 🔐 **Secure Authentication**: OAuth 2.0 with PKCE flow using Microsoft EntraID
- 🌐 **12 Languages Supported**: English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Korean, Arabic, Russian, and Hindi
- 👤 **Personalized Greetings**: Enter a name to create personalized greetings
- 🎨 **Beautiful UI**: Modern, responsive design with gradient backgrounds
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance
- 🛡️ **Security First**: PKCE implementation following OAuth 2.0 best practices

## Screenshots

### Default View
![Default greeting in English](https://github.com/user-attachments/assets/05ba2a1c-1f47-4f10-baf5-8ceed9e4033a)

### Greeting with Name
![Japanese greeting with name](https://github.com/user-attachments/assets/dfefb475-567d-4add-9ab6-21e7cb71fd0f)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- A Microsoft Azure account (for authentication setup)

### Authentication Setup

This app requires EntraID (Azure Active Directory) authentication. Follow these steps:

1. **Set up EntraID App Registration**
   - See the detailed guide: [ENTRAID_SETUP.md](./ENTRAID_SETUP.md)
   - Register your application in Azure Portal
   - Configure redirect URIs and permissions

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your EntraID credentials:
   ```env
   VITE_ENTRA_CLIENT_ID=your-client-id-here
   VITE_ENTRA_TENANT_ID=common
   VITE_ENTRA_REDIRECT_URI=http://localhost:5173
   ```

   See [ENTRAID_SETUP.md](./ENTRAID_SETUP.md) for detailed configuration instructions.

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

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

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
- **CSS3**: Custom styling with gradients and animations
- **OAuth 2.0 + PKCE**: Secure authentication flow
- **Microsoft EntraID**: Azure Active Directory for identity management

## Authentication

This application implements secure authentication using:

- **PKCE (Proof Key for Code Exchange)**: Enhanced OAuth 2.0 security for public clients
- **Microsoft EntraID**: Enterprise-grade identity platform
- **Session-based tokens**: Secure token storage in browser session
- **State validation**: CSRF protection

For detailed setup instructions, see [ENTRAID_SETUP.md](./ENTRAID_SETUP.md).

### Authentication Flow

1. User clicks "Sign in with Microsoft"
2. Redirected to Microsoft login page
3. User authenticates with Microsoft credentials
4. Application receives authorization code
5. Code is exchanged for access and ID tokens using PKCE
6. User information is extracted and displayed
7. User can access the greeting features

## Project Structure

```
fictional-octo-lamp/
├── src/
│   ├── auth/
│   │   ├── pkce.js           # PKCE utility functions
│   │   ├── authService.js     # EntraID authentication service
│   │   └── AuthContext.jsx    # React authentication context
│   ├── App.jsx                # Main application component
│   ├── App.css                # Application styles
│   ├── main.jsx               # Entry point with AuthProvider
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies and scripts
├── .env.example               # Example environment configuration
├── ENTRAID_SETUP.md           # Detailed authentication setup guide
└── README.md                  # This file
```

## How It Works

The app uses React state management and authentication context to:
1. Authenticate users with Microsoft EntraID using PKCE flow
2. Track the authenticated user's information
3. Track the selected language
4. Store the user's name
5. Display the appropriate greeting based on the selected language
6. Protect greeting functionality behind authentication

The greeting updates instantly when you select a different language or type in a name.

## Security Features

- ✅ OAuth 2.0 with PKCE (Proof Key for Code Exchange)
- ✅ State parameter for CSRF protection
- ✅ Secure token storage in session storage
- ✅ Token expiration validation
- ✅ No client secrets in frontend code
- ✅ Following Microsoft security best practices

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

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.