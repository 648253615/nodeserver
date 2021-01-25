# nodeserver
Node.js  Web application services

### Centos configuration
```
# ssh
ssh-keygen -t rsa
ssh -T git@github.com

# firewall
systemctl start firewalld
firewall-cmd --list-all
firewall-cmd --add-port=80/tcp --permanent
firewall-cmd --remove-port=80/tcp --permanent
firewall-cmd --reload

# nginx
yum install -y nginx
systemctl start nginx
nginx -s reload

# node
wget https://nodejs.org/dist/v15.6.0/node-v15.6.0-linux-x64.tar.xz
tar -xf node-v15.6.0-linux-x64.tar.xz
ln -s /home/node-v15.6.0-linux-x64/bin/node /bin/node
ln -s /home/node-v15.6.0-linux-x64/bin/npm /bin/npm
npm install pm2 -g
ln -s /home/node-v15.6.0-linux-x64/bin/pm2 /bin/pm2

# mongodb
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-4.4.3.tgz
tar -xf mongodb-linux-x86_64-rhel80-4.4.3.tgz
ln -s /home/mongodb-linux-x86_64-rhel80-4.4.3/bin/mongo /bin/mongo
ln -s /home/mongodb-linux-x86_64-rhel80-4.4.3/bin/mongod /bin/mongod
mongod --config /home/mongodb-linux-x86_64-rhel80-4.4.3/mongod.conf
// mongod.conf
storage:
  dbPath: /home/mongodb-linux-x86_64-rhel80-4.4.3/data
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
  path: /home/mongodb-linux-x86_64-rhel80-4.4.3/mongod.log
processManagement:
   fork: true
net:
  port: 27017
  bindIp: 127.0.0.1
```