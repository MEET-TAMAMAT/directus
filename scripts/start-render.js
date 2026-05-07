#!/usr/bin/env node

/**
 * Render startup script for Directus
 * This script handles environment setup and starts the Directus server
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { URL } from 'url';

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

// Parse DATABASE_URL and set individual DB environment variables
if (process.env.DATABASE_URL) {
    try {
        const dbUrl = new URL(process.env.DATABASE_URL);

        process.env.DB_CLIENT = 'pg';
        process.env.DB_HOST = dbUrl.hostname;
        process.env.DB_PORT = dbUrl.port || '5432';
        process.env.DB_DATABASE = dbUrl.pathname.slice(1); // Remove leading slash
        process.env.DB_USER = dbUrl.username;
        process.env.DB_PASSWORD = dbUrl.password;

        console.log('✅ Parsed DATABASE_URL and set individual DB environment variables');
        console.log(`📍 DB_HOST: ${process.env.DB_HOST}`);
        console.log(`🔌 DB_PORT: ${process.env.DB_PORT}`);
        console.log(`🗄️ DB_DATABASE: ${process.env.DB_DATABASE}`);
        console.log(`👤 DB_USER: ${process.env.DB_USER}`);
    } catch (error) {
        console.error('❌ Failed to parse DATABASE_URL:', error.message);
        process.exit(1);
    }
} else {
    console.error('❌ DATABASE_URL environment variable is missing');
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
};

// Apply default environment variables
for (const [key, value] of Object.entries(defaultEnvVars)) {
    if (!process.env[key]) {
        process.env[key] = value;
        console.log(`📝 Set default env var: ${key}=${value}`);
    }
}

// Verify required environment variables
const requiredEnvVars = ['DATABASE_URL', 'KEY', 'SECRET', 'DB_HOST', 'DB_PORT', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('   Make sure these are set in your Render dashboard');
    process.exit(1);
}

console.log('✅ All environment variables validated');

// Initialize database (bootstrap creates everything needed)
console.log('🔍 Initializing Directus database...');
const checkDbProcess = spawn('node', ['dist/cli/run.js', 'bootstrap'], {
    cwd: apiPath,
    stdio: 'pipe',
    env: process.env
});

let dbInitNeeded = false;
let dbCheckOutput = '';

checkDbProcess.stdout.on('data', (data) => {
    const output = data.toString();
    dbCheckOutput += output;
    console.log('📊 DB Check:', output.trim());
});

checkDbProcess.stderr.on('data', (data) => {
    const output = data.toString();
    dbCheckOutput += output;
    console.log('⚠️ DB Check Warning:', output.trim());
});

checkDbProcess.on('close', (code) => {
    if (code === 0) {
        console.log('✅ Database initialized successfully');
    } else {
        console.log(`⚠️ Database check/init completed with code ${code}`);
    }

    // Start Directus regardless of initialization result
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
});