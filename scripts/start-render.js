#!/usr/bin/env node

/**
 * Render startup script for Directus
 * This script handles environment setup and starts the Directus server
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const apiPath = join(projectRoot, 'api');

console.log('🚀 Starting Directus on Render...');
console.log(`📁 Project root: ${projectRoot}`);
console.log(`🔧 API path: ${apiPath}`);

// Check if the API dist directory exists
const distPath = join(apiPath, 'dist');
if (!existsSync(distPath)) {
    console.error('❌ API dist directory not found. Make sure the build completed successfully.');
    process.exit(1);
}

// Set default environment variables if not provided
const defaultEnvVars = {
    NODE_ENV: 'production',
    HOST: '0.0.0.0',
    PORT: process.env.PORT || '10000',
    LOG_LEVEL: 'info',
    CORS_ENABLED: 'true',
    CORS_ORIGIN: 'true',
    STORAGE_LOCATIONS: 'local',
    STORAGE_LOCAL_DRIVER: 'local',
    STORAGE_LOCAL_ROOT: './uploads',
    // Database client
    DB_CLIENT: 'pg',
};

// Apply default environment variables
for (const [key, value] of Object.entries(defaultEnvVars)) {
    if (!process.env[key]) {
        process.env[key] = value;
        console.log(`📝 Set default env var: ${key}=${value}`);
    }
}

// Verify required environment variables
const requiredEnvVars = ['DATABASE_URL', 'KEY', 'SECRET'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('   Make sure these are set in your Render dashboard');
    process.exit(1);
}

console.log('✅ Environment variables validated');

// Start Directus
console.log('🎯 Starting Directus server...');
const startProcess = spawn('node', ['dist/cli/run.js', 'start'], {
    cwd: apiPath,
    stdio: 'inherit',
    env: process.env
});

startProcess.on('error', (error) => {
    console.error('❌ Failed to start Directus:', error);
    process.exit(1);
});

startProcess.on('close', (code) => {
    console.log(`🔚 Directus process exited with code ${code}`);
    process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    startProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    startProcess.kill('SIGINT');
});