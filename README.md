# Multi-Language Greeting App

A simple and elegant React.js SPA (Single Page Application) that allows you to greet people in multiple languages! 🌍

![Multi-Language Greeting App](https://github.com/user-attachments/assets/05ba2a1c-1f47-4f10-baf5-8ceed9e4033a)

## Features

- 🌐 **12 Languages Supported**: English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Korean, Arabic, Russian, and Hindi
- 👤 **Personalized Greetings**: Enter a name to create personalized greetings
- 🎨 **Beautiful UI**: Modern, responsive design with gradient backgrounds
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance

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

## Project Structure

```
fictional-octo-lamp/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## How It Works

The app uses React state management to:
1. Track the selected language
2. Store the user's name
3. Display the appropriate greeting based on the selected language

The greeting updates instantly when you select a different language or type in a name.

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