# docker build -t swingset-node .
# docker run -e NODE_ENV=production --network mynetwork -v /sockets:/socket -v /node-config:/config:ro swingset-node

# in /etc/fstab
# none /sockets tmpfs size=64k,uid=121000,gid=121000 0 2

FROM node:lts-slim

# install packages
RUN apt-get update && apt-get -y upgrade && \
apt-get install --no-install-recommends -y busybox-static moreutils python3.5
RUN for x in node vehicle-svr; do adduser --system --gecos ,,, "$x"; done

# install node modules
RUN mkdir /app && cd /app && yarn add express fs

# wordgame
ADD wordgame.zip /
RUN mkdir -p /app/wordgame && cd /app/wordgame && busybox unzip /wordgame.zip

# mtd-vehicle-server
ADD mtd-vehicle-server /app/mtd-vehicle-server
ARG MTD_URLFILE=/config/mtd-urls.txt

# main, inittab
ADD index.js short-urls.json more_middleware.js /app/
ADD inittab /etc

# I feel compelled to modify busybox init to call exit() if run in a Docker container
STOPSIGNAL SIGKILL

CMD ["/bin/busybox", "init"]
