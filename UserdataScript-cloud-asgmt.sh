#!/bin/bash -xe
cd ~
sudo rm -rf cloud_asgmt

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

# Create .env file with database and application configuration
sudo tee /home/ubuntu/cloud_asgmt/.env > /dev/null <<EOF
DB_HOST=cloudasgmtdb.c9lwn3mv3tfg.us-east-1.rds.amazonaws.com
DB_USER=nodeapp
DB_PASSWORD=student12
DB_NAME=STUDENTS
APP_PORT=80
AWS_REGION=us-east-1
S3_BUCKET_NAME=cloudasgmtyeohs3
EOF

# Fix ownership and permissions
sudo chown ubuntu:ubuntu /home/ubuntu/cloud_asgmt/.env
sudo chmod 600 /home/ubuntu/cloud_asgmt/.env

# Start the application with sudo (required for port 80)
cd /home/ubuntu/cloud_asgmt
sudo npm start &

