// d:\projects\personal-projects\to-do-list\server\src\config\supabase.js
const { createClient } = require('@supabase/supabase-js');

// These must be set in your .env file
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('⚠️ Supabase credentials not found in .env. Attachments will not work.');
}

module.exports = supabase;

// ✅ DONE
