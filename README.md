# Melody Backoffice Web

Administration web application for the Melody platform, built with Next.js and TypeScript.

## Quick Start

### Prerequisites

- Node.js 18.x or newer
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Wooper-Melody/Backoffice-Web.git
cd Backoffice-Web
```

2. Install the dependencies:

```bash
npm install
```

3. Edit `.env.local` with your settings:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://melody-gateway-main-a53fb73.zuplo.app

# Environment
NODE_ENV=development
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables Configuration

### Public Variables (Frontend)

Variables that start with `NEXT_PUBLIC_` are available in the frontend:

- `NEXT_PUBLIC_API_URL`: Base URL for the Melody Gateway API

### Private Variables (Backend/Server)

- `NODE_ENV`: Execution environment (`development`, `production`, `test`)

### Env Files

- `.env.local`: Local development variables (not committed)
- `.env.production`: Production variables (set in your deployment platform)

## Architecture

### Project Structure

```
app/
├── (dashboard)/        # Protected dashboard routes
├── api/                # Next.js API routes
├── globals.css         # Global styles
├── layout.tsx          # Main layout
└── page.tsx            # Home page

components/
├── ui/                 # Base UI components (shadcn/ui)
├── layout/             # Layout components
├── modals/             # Modal components
└── [feature]/          # Feature-specific components

lib/
├── api.ts              # API client with configuration
└── utils.ts            # General utilities
```

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styles**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: SWR for data fetching
- **Form Handling**: React Hook Form + Zod

## Available Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # Code linter
```

## Deployment

### Vercel (Recommended)

1. Connect your repository in [Vercel](https://vercel.com)
2. Configure environment variables in the Vercel dashboard
3. Deploy automatically

### Environment Variables for Production

```bash
NEXT_PUBLIC_API_URL=https://your-production-api.com
NODE_ENV=production
# Add other variables as needed
```

## Contribution

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make your changes and commit: `git commit -m 'Add new feature'`
3. Push the branch: `git push origin feature/new-feature`
4. Open a Pull Request

## Debugging

### API Logs

In development, API logs are printed to the browser console with the corresponding prefix.

### Environment Variables

Verify that the variables are loaded correctly:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
```

## Additional Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [SWR](https://swr.vercel.app/)

## License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.
