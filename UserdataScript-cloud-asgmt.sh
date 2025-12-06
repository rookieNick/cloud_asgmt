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
export APP_DB_HOST=cloudasgmtdb.c9lwn3mv3tfg.us-east-1.rds.amazonaws.com
export APP_DB_USER=nodeapp
export APP_DB_PASSWORD=student12
export APP_DB_NAME=STUDENTS
export APP_PORT=80

# Start the application
npm start &

# Create startup script for persistence across reboots
echo '#!/bin/bash -xe
cd /home/ubuntu/cloud_asgmt
export APP_PORT=80
npm start' > /etc/rc.local
chmod +x /etc/rc.local
