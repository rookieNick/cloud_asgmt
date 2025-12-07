#!/bin/bash -xe
sudo apt update -y
sudo apt install nodejs npm mysql-client git -y

# Create app directory
sudo mkdir -p /home/ubuntu/cloud_asgmt
cd /home/ubuntu/cloud_asgmt

# Clone your project
sudo git clone https://github.com/rookieNick/cloud_asgmt.git .

# Install dependencies
sudo npm install
sudo npm install aws-sdk

# Export database configuration
export DB_HOST=cloudasgmtdb.c9lwn3mv3tfg.us-east-1.rds.amazonaws.com
export DB_USER=nodeapp
export DB_PASSWORD=student12
export DB_NAME=STUDENTS
export APP_PORT=80

# Export AWS S3 configuration for profile images
export AWS_REGION=us-east-1
export S3_BUCKET_NAME=cloudasgmtyeohs3

# Start the application
sudo npm start &

# Create startup script for persistence across reboots
echo '#!/bin/bash -xe
cd /home/ubuntu/cloud_asgmt
export APP_PORT=80
sudo npm start' > /etc/rc.local
sudo chmod +x /etc/rc.local
