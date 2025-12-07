require('dotenv').config();
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3Service = {
  // Upload file to S3
  uploadFile: async (file, studentId) => {
    if (!file) return null;

    const fileExtension = file.originalname.split('.').pop();
    const timestamp = Date.now();
    const fileName = `student-profiles/${studentId}-${timestamp}.${fileExtension}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    try {
      const result = await s3.upload(params).promise();
      return result.Location; // Returns the S3 URL
    } catch (err) {
      console.error('S3 upload error:', err);
      throw new Error('Failed to upload profile image to S3');
    }
  },

  // Delete file from S3
  deleteFile: async (fileUrl) => {
    if (!fileUrl) return;

    try {
      // Extract the key from the S3 URL
      const bucketName = process.env.S3_BUCKET_NAME;
      const key = fileUrl.split(`${bucketName}/`)[1];

      if (!key) return;

      const params = {
        Bucket: bucketName,
        Key: key
      };

      await s3.deleteObject(params).promise();
      console.log(`Deleted S3 file: ${key}`);
    } catch (err) {
      console.error('S3 delete error:', err);
      // Don't throw error, just log it
    }
  }
};

module.exports = s3Service;
