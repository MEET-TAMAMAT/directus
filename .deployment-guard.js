#!/usr/bin/env node

/**
 * Deployment Guard - Prevents accidental cross-environment deployments
 * Run this before any deployment commands
 */

const environment = process.env.DEPLOYMENT_ENV || 'unknown';
const allowedCommands = {
  'railway': ['railway', 'rail'],
  'render': ['render', 'npm run deploy:render']
};

function validateDeployment() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!environment || environment === 'unknown') {
    console.error('❌ DEPLOYMENT_ENV not set. Set to "railway" or "render"');
    process.exit(1);
  }

  if (environment === 'production' && command.includes('render')) {
    console.error('❌ Cannot deploy to Render from production environment');
    process.exit(1);
  }

  if (environment === 'staging' && command.includes('railway')) {
    console.error('❌ Cannot deploy to Railway from staging environment');
    process.exit(1);
  }

  console.log(`✅ Deployment to ${environment} approved`);
}

validateDeployment();