require('dotenv').config();
const mysql = require('mysql2/promise');
const AWS = require('aws-sdk');

// Initialize config with defaults
let dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'cloud',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Try to fetch credentials from AWS Secrets Manager
const client = new AWS.SecretsManager({
  region: 'us-east-1'
});

const secretName = 'Mydbsecret';

client.getSecretValue({ SecretId: secretName }, function(err, data) {
  if (err) {
    console.log('Secrets Manager not available. Using environment variables or defaults...');
  } else {
    if ('SecretString' in data) {
      const secret = JSON.parse(data.SecretString);
      dbConfig.host = secret.host || dbConfig.host;
      dbConfig.user = secret.user || dbConfig.user;
      dbConfig.password = secret.password || dbConfig.password;
      dbConfig.database = secret.db || dbConfig.database;
      console.log('Database credentials loaded from AWS Secrets Manager');
    }
  }
});

const pool = mysql.createPool(dbConfig);

module.exports = pool;
