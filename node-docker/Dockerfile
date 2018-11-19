# docker build -t swingset-node .
# docker run -e NODE_ENV=production --network none -v /sockets:/socket swingset-node

# in /etc/fstab
# none /sockets tmpfs size=64k,uid=121000,gid=121000 0 2

FROM node:8-slim

ADD wordgame.zip /
RUN apt-get update && apt-get install -y busybox-static
RUN mkdir -p /app/wordgame && cd /app/wordgame && busybox unzip /wordgame.zip
RUN cd /app && yarn add express
ADD index.js /app

CMD su -c 'cd /app && rm -f /socket/socket && exec node index.js' node
