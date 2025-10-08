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

3. Configure environment variables:

```bash
# For development
cp .env.local.example .env.local
# Edit .env.local with your API settings
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Configuration

### Local Development Workflow

This project uses a specific environment configuration workflow:

| Command | Environment File | NODE_ENV | API URL | Use Case |
|---------|------------------|----------|---------|----------|
| `npm run dev` | `.env.local` | `development` | `localhost:30002` | Local development |
| `npm run dev` | `.env.local` | `production` | Production Gateway | Local production testing |
| Vercel Deploy | Vercel Variables | `production` | Production Gateway | Live production (main branch only) |

### Environment Files

- **`.env.local`** - Development environment (not committed)
- **`.env.production`** - Local production testing (not committed) 
- **`.env.local.example`** - Template for both environments

### Public Variables (Frontend)

Variables that start with `NEXT_PUBLIC_` are available in the frontend:

- `NEXT_PUBLIC_API_URL`: Base URL for the Melody Gateway API

### Private Variables (Backend/Server)

- `NODE_ENV`: Execution environment (`development`, `production`)

### Deployment Strategy

- **Local Development**: Work on any branch using `.env.local`
- **Local Production Testing**: Test production build locally using `.env.production`
- **Production Deploy**: Only `main` branch deploys to Vercel automatically
- **Branch Protection**: No automatic deploys from `dev` or feature branches

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
npm run dev        # Development server (uses .env.local)
npm run build      # Production build
npm run start      # Production server
npm run lint       # Code linter
```

## Deployment

### Vercel Configuration

This project is configured with a specific deployment strategy:

#### Deployment Rules
- **Production**: Only `main` branch deploys automatically
- **Preview**: Other branches (`dev`, features) do NOT deploy
- **Local Testing**: Use `npm run dev` to test.

#### Vercel Environment Variables (Production Only)
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=API_GATEWAY_URL_HERE
```

#### Setup Steps in Vercel:
1. Connect your repository
2. Set **Production Branch**: `main`
3. Disable **Preview Deployments** for other branches
4. Configure environment variables:
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_API_URL` = `API_GATEWAY_URL_HERE`

#### Workflow:
1. **Development**: Work on `dev` branch with `npm run dev` (uses `.env.local`)
2. **Testing**: Test production locally with `npm run dev` (uses `.env.local but change to match production variables`)
3. **Production**: Merge to `main` → Automatic deployment to Vercel

## Contribution

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make your changes and commit: `git commit -m 'Add new feature'`
3. Push the branch: `git push origin feature/new-feature`
4. Open a Pull Request

## Additional Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [SWR](https://swr.vercel.app/)

## License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.
