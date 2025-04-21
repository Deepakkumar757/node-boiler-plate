import { config } from 'dotenv';

// Load test environment variables
process.env.NODE_ENV = 'test';
process.env.ACCESS_SECRET = 'test-access-secret';
process.env.REFRESH_SECRET = 'test-refresh-secret';
// Add any other required environment variables here

config();
