# Express Server with Auto-Generated Domain Routes

A robust Express.js server with middleware, error handling, and auto-generated domain routes.

## Features

- Express.js server with essential middleware
- Automated domain route generation
- Built-in error handling
- Swagger API documentation
- ESLint and Prettier for code consistency
- TypeScript support
- Environment-based configuration with Zod validation

## Configuration System

The application uses a robust configuration system with Zod schema validation:

### Structure

```typescript
// Configuration is divided into logical groups:
{
  db: {
    DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASSWORD, DB_SCHEMA
  },
  jwt: {
    ACCESS_SECRET, REFRESH_SECRET
  },
  server: {
    PORT, SWAGGER, RETRY_LIMIT
  },
  init: {
    INITIALIZATION_DB, INITIALIZATION_MIGRATION
  }
}
```

### Usage

Always use the configuration system instead of directly accessing process.env:

```typescript
// ❌ Don't do this
const port = process.env.PORT;

// ✅ Do this instead
import { serverConfig } from './config';
const port = serverConfig.PORT;
```

### Adding New Configuration

1. Define the schema in `src/config/config.schema.ts`
2. Add validation rules and default values
3. Update the configuration type
4. Access via the validated config object

Example:
```typescript
// In config.schema.ts
const newFeatureSchema = z.object({
  FEATURE_FLAG: z.string().default('false'),
  FEATURE_LIMIT: z.string().default('10')
});

// In your code
import { newFeatureConfig } from './config';
const limit = newFeatureConfig.FEATURE_LIMIT;
```

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
