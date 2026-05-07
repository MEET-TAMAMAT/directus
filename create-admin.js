#!/usr/bin/env node

/**
 * Direct admin user creation for Directus
 * This script connects directly to the database and creates an admin user
 */

import { URL } from 'url';
import pkg from 'pg';
const { Client } = pkg;
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is required');
    process.exit(1);
}

console.log('🔧 Creating admin user directly in database...');

const dbUrl = new URL(DATABASE_URL);
const client = new Client({
    host: dbUrl.hostname,
    port: dbUrl.port || 5432,
    database: dbUrl.pathname.slice(1),
    user: dbUrl.username,
    password: dbUrl.password,
    ssl: { rejectUnauthorized: false }
});

async function createAdmin() {
    try {
        await client.connect();
        console.log('✅ Connected to database');

        // Check if admin role exists
        const roleResult = await client.query(
            "SELECT id FROM directus_roles WHERE admin_access = true LIMIT 1"
        );

        let adminRoleId;
        if (roleResult.rows.length === 0) {
            // Create admin role
            const roleId = randomBytes(16).toString('hex');
            await client.query(
                "INSERT INTO directus_roles (id, name, icon, description, ip_access, enforce_tfa, admin_access, app_access) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                [roleId, 'Administrator', 'verified', 'Administrative users', null, false, true, true]
            );
            adminRoleId = roleId;
            console.log('✅ Created admin role');
        } else {
            adminRoleId = roleResult.rows[0].id;
            console.log('✅ Found existing admin role');
        }

        // Get admin credentials from environment or use defaults
        const adminEmail = process.env.INIT_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@directus.local';
        const adminPassword = process.env.INIT_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'DirectusAdmin123!';

        // Delete existing user if exists
        await client.query("DELETE FROM directus_users WHERE email = $1", [adminEmail]);
        console.log('🗑️ Removed any existing admin user');

        // Create new admin user
        const userId = randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        await client.query(
            "INSERT INTO directus_users (id, first_name, last_name, email, password, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [userId, 'Admin', 'User', adminEmail, hashedPassword, adminRoleId, 'active']
        );

        console.log('🎉 Admin user created successfully!');
        console.log('📧 Email:', adminEmail);
        console.log('🔐 Password:', adminPassword);

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
    } finally {
        await client.end();
    }
}

createAdmin();