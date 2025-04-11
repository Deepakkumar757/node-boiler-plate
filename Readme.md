# Express Server with Auto-Generated Domain Routes

A robust Express.js server with middleware, error handling, and auto-generated domain routes.

## Features

- Express.js server with essential middleware
- Automated domain route generation
- Built-in error handling
- Swagger API documentation
- ESLint and Prettier for code consistency
- TypeScript support

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Development

To start the development server with hot-reload:

```bash
npm run dev
```

### Building

To build the project:

```bash
npm run build
```

### Production

To start the production server:

```bash
npm start
```

## Project Structure

```
src/
├── config/         # Configuration files
├── domain/        # Auto-generated domain routes
├── lib/           # Common utilities and middleware
├── middleware/    # Express middleware
└── scripts/       # Build and generation scripts
```

## Domain Generation

The project uses an automated domain generation system. Be careful when naming domains as they will automatically generate:

- Controllers
- Services
- Validation
- Routes
- Swagger documentation

## Code Style

This project uses ESLint and Prettier to maintain code quality and consistency. Make sure to follow the coding standards defined in the configuration files:

- `.eslintrc`
- `.prettierrc`

## API Documentation

API documentation is automatically generated using Swagger and is available at:
`http://localhost:{PORT}/api-docs`
