# ProVerse 🚀

**An AI-powered universe for Product Managers** - Complete product development lifecycle management from ideation to deployment.

## Overview

ProVerse is a comprehensive SaaS platform designed specifically for product managers to streamline their entire workflow. From brainstorming and wireframing to code generation and QA testing, ProVerse provides an integrated AI-powered environment that accelerates product development.

## ✨ Key Features

### 🎯 Core Modules
- **Website & Onboarding** - Modern landing page with multiple auth options
- **Brainstorming** - AI-assisted ideation, USP analysis, and competitor research
- **Wireframing** - Convert ideas to AI-generated wireframes or upload existing ones
- **Figma Integration** - Transform Figma designs into comprehensive PRDs
- **Code Generation** - Convert PRDs into full-fledged applications
- **App Editor** - In-browser code editing and deployment
- **QA Automation** - AI-powered test case generation and execution
- **Analytics** - Product analytics with user journey mapping
- **Bug Tracking** - AI-powered bug analysis with JIRA integration

### 🤖 AI-Powered Features
- **Smart Assistant** - Context-aware AI chat in every module
- **Vector Memory** - All interactions stored and contextualized
- **Meeting Integration** - Google Meet scheduling with auto-summarization
- **Recording Capabilities** - Conversation recording and analysis
- **Intelligent Insights** - AI-driven recommendations and solutions

## 🏗️ Architecture

```
ProVerse/
├── frontend/          # Next.js 14 with TypeScript & Tailwind
├── backend/           # Node.js Express API
├── shared/            # Shared types and utilities
├── docs/              # Comprehensive documentation
└── scripts/           # Automation scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL (or Supabase)
- Required API keys (see `.env.example`)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/proverse/proverse.git
cd proverse
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys and configuration
```

4. **Run the development servers**
```bash
npm run dev
```

Visit `http://localhost:3000` for the frontend and `http://localhost:3001` for the API.

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env.local` and configure:

- **Database**: Supabase URL and keys
- **AI Services**: OpenAI, Anthropic API keys
- **Google Services**: Meet, Drive, Analytics
- **Integrations**: Figma, JIRA, Confluence, Notion
- **Vector DB**: Pinecone configuration

### API Keys Setup
Detailed setup instructions for each service:
- [Authentication Setup](docs/setup/api-keys.md)
- [Google Services](docs/setup/google-integration.md)
- [Figma Integration](docs/setup/figma-setup.md)
- [JIRA Configuration](docs/setup/jira-setup.md)

## 📚 Documentation

- [API Documentation](docs/api/README.md)
- [User Guide](docs/user-guide/README.md)
- [Deployment Guide](docs/deployment/README.md)
- [Development Setup](docs/setup/local-development.md)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only

# Building
npm run build            # Build production bundles
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Testing
npm run test             # Run all tests
npm run test:frontend    # Frontend tests
npm run test:backend     # Backend tests

# Linting
npm run lint             # Lint all code
npm run lint:frontend    # Lint frontend
npm run lint:backend     # Lint backend
```

### Project Structure

```
frontend/src/
├── app/               # Next.js app router
├── components/        # React components
│   ├── layout/        # Layout components
│   ├── shared/        # Shared UI components
│   └── modules/       # Feature-specific components
├── hooks/             # Custom React hooks
├── services/          # API clients and services
└── types/             # TypeScript definitions

backend/src/
├── routes/            # Express routes
├── services/          # Business logic services
├── modules/           # Feature modules
├── middleware/        # Express middleware
└── utils/             # Utility functions
```

## 🔌 Integrations

- **Google Meet** - Meeting scheduling and recording
- **Figma** - Design to PRD conversion
- **JIRA** - Bug tracking and project management
- **Confluence** - Documentation export
- **Notion** - Alternative documentation platform
- **Pinecone** - Vector database for AI context
- **Supabase** - Database and authentication

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run deploy
```

### Docker
```bash
docker-compose up --build
```

### Manual Deployment
See [Deployment Guide](docs/deployment/README.md) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

- 📧 Email: support@proverse.com
- 💬 Discord: [Join our community](https://discord.gg/proverse)
- 📖 Documentation: [docs.proverse.com](https://docs.proverse.com)
- 🐛 Issues: [GitHub Issues](https://github.com/proverse/proverse/issues)

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Custom AI model training
- [ ] Enterprise SSO integration
- [ ] Mobile app development
- [ ] Advanced collaboration features

---

**Built with ❤️ by the ProVerse team**