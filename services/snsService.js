const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

// Configuration
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const TOPIC_NAME = process.env.SNS_TOPIC_NAME || "studentdata";

// Construct the ARN for the SNS topic
const TOPIC_ARN = `arn:aws:sns:${AWS_REGION}:${AWS_ACCOUNT_ID}:${TOPIC_NAME}`;

const snsClient = new SNSClient({ region: AWS_REGION });

const snsService = {
  // Publish notification when a new student is created
  publishStudentNotification: async (studentData) => {
    try {
      // Validate that we have the necessary environment variables
      if (!AWS_ACCOUNT_ID) {
        console.warn("WARNING: AWS_ACCOUNT_ID not set. SNS notification not sent.");
        return;
      }

      const params = {
        Message: `New Student Enrollment Notification\n\n` +
                 `Name: ${studentData.name}\n` +
                 `Email: ${studentData.email}\n` +
                 `Phone: ${studentData.phone}\n` +
                 `Address: ${studentData.address}, ${studentData.city}, ${studentData.state}\n` +
                 `Enrollment Time: ${new Date().toISOString()}`,
        TopicArn: TOPIC_ARN,
        Subject: `New Student Enrolled: ${studentData.name}`
      };

      const data = await snsClient.send(new PublishCommand(params));
      console.log(`SUCCESS: SNS Email Notification Sent. MessageID: ${data.MessageId}`);
      return data;
    } catch (err) {
      console.error("ERROR: Failed to send SNS email notification.", err.message);
      // Don't throw error - allow the student creation to succeed even if SNS fails
    }
  }
};

module.exports = snsService;
