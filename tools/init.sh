#!/bin/bash
set -e

APT_SRC=http://mirrors.tuna.tsinghua.edu.cn/ubuntu
#APT_PROXY=http://192.168.20.20:3142
#PROXY_PROTOCOL=http
#PROXY_SERVER=192.168.20.20
#PROXY_PORT=1080

sed -i 's/deb-src/#deb-src/g' /etc/apt/sources.list

if [ -n "$APT_SRC" ]; then
  sed -i 's|^deb.*archive.ubuntu.com/ubuntu|deb '"$APT_SRC"'|g' /etc/apt/sources.list
  sed -i 's|^\(deb.*security.ubuntu.com.*$\)|#\1|g' /etc/apt/sources.list
fi

if [ -n "$APT_PROXY" ]; then
  echo Acquire::http::Proxy \"$APT_PROXY\"\; > /etc/apt/apt.conf.d/02proxy
fi

apt-get update
env DEBIAN_FRONTEND=noninteractive apt-get install -y npm maven

if [ -n "$PROXY_PROTOCOL" ]; then
  npm config set proxy=$PROXY_PROTOCOL://$PROXY_SERVER:$PROXY_PORT
  sed -i 's/  <\/proxies>/    <proxy>\n      <id>proxy<\/id>\n      <active>true<\/active>\n      <protocol>'"$PROXY_PROTOCOL"'<\/protocol>\n      <host>'"$PROXY_SERVER"'<\/host>\n      <port>'"$PROXY_PORT"'<\/port>\n    <\/proxy>\n  <\/proxies>/g' /etc/maven/settings.xml
fi

npm install -g gulp-cli
npm install

set +e
/tools/build.sh
ret=$?
set -e

if [ $ret -ne 0 ]; then
  read -p "First build failed. Try again? (Y/n) " ans
  ans=${ans:-Y}
  if [ $ans = 'Y' ] || [ $ans = 'y' ]; then
    /tools/build.sh
  fi
fi
