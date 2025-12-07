// db.js

require('dotenv').config();
const mysql = require('mysql2/promise');
const AWS = require('aws-sdk'); // SDK V2 is fine for this example, but V3 is newer.

// 1. Initialize config with defaults (useful fallback)
let dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'cloud',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// 2. Define an async function to retrieve and configure the pool
async function initializeDatabasePool() {
    const client = new AWS.SecretsManager({
        region: 'us-east-1'
    });
    const secretName = 'Mydbsecret';

    try {
        // Use the promise-based version of getSecretValue for async/await
        const data = await client.getSecretValue({ SecretId: secretName }).promise();

        if (data.SecretString) {
            const secret = JSON.parse(data.SecretString);
            
            // 3. Update config with secure, retrieved values
            dbConfig.host = secret.host || dbConfig.host;
            dbConfig.user = secret.username || secret.user || dbConfig.user; // Common Secret Manager field is 'username'
            dbConfig.password = secret.password || dbConfig.password;
            dbConfig.database = secret.db || secret.dbname || dbConfig.database; // Common Secret Manager field is 'dbname'

            console.log('Database credentials successfully loaded from AWS Secrets Manager');
        }
    } catch (err) {
        // Log the error but allow execution to continue using defaults/environment variables
        console.error('ERROR: Failed to retrieve secret from AWS Secrets Manager.', err.message);
        // CRITICAL: In a production environment, you would likely want to process.exit(1) here 
        // if the secret is mandatory, to prevent connection with defaults.
    }

    // 4. CREATE THE POOL *AFTER* THE ASYNCHRONOUS CALL IS COMPLETE
    const pool = mysql.createPool(dbConfig);
    console.log(`MySQL Pool created for host: ${dbConfig.host} with connection limit: ${dbConfig.connectionLimit}`);
    
    return pool;
}

// 5. EXPORT THE PROMISE OF THE POOL
const poolPromise = initializeDatabasePool();

module.exports = poolPromise;
