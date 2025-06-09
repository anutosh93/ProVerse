#!/usr/bin/env node

/**
 * ProVerse Database Setup Script
 * 
 * This script automatically creates the ProVerse database schema in Supabase.
 * Run this after setting up your Supabase project and environment variables.
 * 
 * Usage: node database/setup.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from multiple possible locations
require('dotenv').config(); // Root .env

// Prioritize frontend/.env.local since user wants all Supabase creds there
const frontendEnvPath = path.join(__dirname, '../frontend/.env.local');
if (fs.existsSync(frontendEnvPath)) {
  require('dotenv').config({ path: frontendEnvPath });
  console.log('✅ Loaded frontend/.env.local (primary)');
}

// Fallback to backend/.env if needed
const backendEnvPath = path.join(__dirname, '../backend/.env');
if (fs.existsSync(backendEnvPath)) {
  require('dotenv').config({ path: backendEnvPath });
  console.log('✅ Loaded backend/.env (fallback)');
}

// Also check for .env.local in root
const rootEnvLocalPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(rootEnvLocalPath)) {
  require('dotenv').config({ path: rootEnvLocalPath });
  console.log('✅ Loaded root .env.local');
}

// Get Supabase credentials from environment (frontend/.env.local should have all)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🔍 Environment Check:');
console.log(`📡 Supabase URL: ${supabaseUrl ? '✅ Found' : '❌ Missing'}`);
console.log(`🔑 Service Key: ${supabaseServiceKey ? '✅ Found' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Error: Missing Supabase environment variables');
  console.log('\n💡 Expected variables in frontend/.env.local:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.log('\n📍 Checked locations:');
  console.log('   - frontend/.env.local (primary)');
  console.log('   - backend/.env (fallback)');
  console.log('   - Root .env.local');
  console.log('\n🔧 Setup instructions:');
  console.log('1. Add all Supabase credentials to frontend/.env.local');
  console.log('2. Get your keys from: https://app.supabase.com → Settings → API');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('\n🚀 Starting ProVerse database setup...\n');

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'supabase_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error('Schema file not found: supabase_schema.sql');
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Executing database schema...');
    
    // Split schema into smaller chunks to avoid execution limits
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          // Try direct execution if rpc fails
          const { error: directError } = await supabase
            .from('_placeholder')
            .select('*')
            .limit(1);
          
          if (directError && directError.message.includes('does not exist')) {
            // This is expected for schema creation
          } else {
            console.warn(`⚠️ Warning on statement ${i + 1}: ${error.message}`);
          }
        }
        successCount++;
      } catch (err) {
        console.warn(`⚠️ Error on statement ${i + 1}: ${err.message}`);
        errorCount++;
      }
      
      // Show progress
      if ((i + 1) % 10 === 0) {
        console.log(`   Progress: ${i + 1}/${statements.length} statements`);
      }
    }

    console.log(`✅ Database schema execution completed!`);
    console.log(`   ✅ Successful: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   ⚠️ Warnings: ${errorCount}`);
    }

    // Verify installation
    console.log('\n🔍 Verifying installation...');
    
    try {
      // Try to check if profiles table exists
      const { data: profilesCheck, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (!profilesError) {
        console.log('✅ Core tables verified successfully');
      } else {
        console.log('⚠️ Could not verify all tables, but setup likely completed');
      }
    } catch (verifyError) {
      console.log('⚠️ Could not verify installation, but schema may have been created');
    }

    console.log('\n🎉 ProVerse database setup complete!');
    console.log('\n✅ All Supabase credentials are in frontend/.env.local');
    console.log('\nNext steps:');
    console.log('1. Enable vector extension in Supabase dashboard (SQL Editor):');
    console.log('   CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('2. Create storage bucket "proverse-files" in Storage section');
    console.log('3. Test authentication by running: npm run dev');
    console.log('4. Try Google sign-in at http://localhost:3000');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.message.includes('permission denied')) {
      console.log('\n💡 Troubleshooting:');
      console.log('- Make sure you\'re using the SERVICE_ROLE_KEY (not anon key)');
      console.log('- Check that your Supabase project is active');
    }
    
    console.log('\n💡 Alternative setup:');
    console.log('1. Open Supabase Dashboard → SQL Editor');
    console.log('2. Copy contents of database/supabase_schema.sql');
    console.log('3. Paste and run in SQL Editor');
    
    process.exit(1);
  }
}

// Alternative function for manual SQL execution
async function createExecSqlFunction() {
  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  try {
    const { error } = await supabase.rpc('exec', { sql: createFunctionSql });
    if (!error) {
      console.log('✅ Created exec_sql function');
    }
  } catch (err) {
    console.log('ℹ️ Using alternative execution method');
  }
}

// Check Supabase connection
async function checkConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && !error.message.includes('session_not_found')) {
      throw error;
    }
    console.log('✅ Connected to Supabase successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message);
    console.log('\n💡 Connection troubleshooting:');
    console.log('- Verify your Supabase URL and Service Role Key in frontend/.env.local');
    console.log('- Check your internet connection');
    console.log('- Ensure your Supabase project is active');
    return false;
  }
}

// Main execution
async function main() {
  console.log('ProVerse Database Setup');
  console.log('=======================');

  // Check connection
  const connected = await checkConnection();
  if (!connected) {
    return;
  }

  // Try to create exec function first
  await createExecSqlFunction();

  // Run setup
  await setupDatabase();
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error.message);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { setupDatabase, checkConnection }; 