#!/bin/bash -xe
apt update -y
apt install nodejs npm mysql-client git -y

# Create app directory
mkdir -p /home/ubuntu/cloud_asgmt
cd /home/ubuntu/cloud_asgmt

# Clone your project
git clone https://github.com/rookieNick/cloud_asgmt.git .

# Install dependencies
npm install
npm install aws-sdk

# Export database configuration
export APP_DB_HOST=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)
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
