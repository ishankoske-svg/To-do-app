// d:\projects\personal-projects\to-do-list\server\src\config\env.js
// Validates essential environment variables to ensure the server crashes early if they are missing
require('dotenv').config();

const { JWT_SECRET, PORT, DATABASE_URL } = process.env;

if (!JWT_SECRET) {
  throw new Error('❌ Missing JWT_SECRET in .env file');
}

if (!DATABASE_URL) {
  throw new Error('❌ Missing DATABASE_URL in .env file');
}

module.exports = {
  JWT_SECRET,
  PORT: PORT || 5000,
  DATABASE_URL
};

// ✅ DONE
