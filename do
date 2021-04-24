#!/bin/bash
set -e

usage() {
  me=$(basename "$0")
  echo "Usage: $me <command>"
  echo "Command list"
  echo "  update_src:  copy source code to the build directory"
  echo "  update_deps: copy dependencies to the build directory"
  echo "  init1:       phase-1 initialization"
  echo "  init2:       phase-2 initialization"
  echo "  build:       build"
  echo "  run:         run in the build directory"
  echo "  rm:          remove the build directory"
  echo "  clear_src:   delete source files matching gitignore"
  exit 1
}

if [ $# -ne 1 ]; then
  usage
fi

SRC_DIR="o2oa-src"
BUILD_DIR="o2oa-build"
BUILD_BASE_IMAGE_NAME="local/o2oa-build-base"
BUILD_BASE_CONTAINER_NAME="o2oa-build-base"
BUILD_IMAGE_NAME="local/o2oa-build"
BUILD_CONTAINER_NAME="o2oa-build"
RUN_CONTAINER_NAME="o2oa-test"

if [ $1 = "update_src" ]; then
  rsync -r "$SRC_DIR"/ "$BUILD_DIR"/
elif [ $1 = "update_deps" ]; then
  mkdir -p $BUILD_DIR/o2server/jvm
  cat deps/jvm.tar.gz.part* | tar xz -C $BUILD_DIR/o2server/jvm && chmod +x $BUILD_DIR/o2server/jvm/linux_java11/bin/*
  cat deps/commons.tar.gz.part* | tar xz -C $BUILD_DIR/o2server
  if [ -f deps/node_modules.tar.gz ]; then
    tar xzf deps/node_modules.tar.gz -C $BUILD_DIR
  fi
elif [ $1 = "init1" ]; then
  docker run -it --name $BUILD_BASE_CONTAINER_NAME \
    --volume $PWD/$BUILD_DIR:/o2oa \
    --volume $PWD/tools:/tools \
    --workdir /o2oa \
    phusion/baseimage:master-amd64 \
    /tools/init1.sh
  read -p "Save Phase-1 image? (Y/n) " ans
  ans=${ans:-Y}
  if [ $ans = 'Y' ] || [ $ans = 'y' ]; then
    if [ -n "$(docker images -q $BUILD_BASE_IMAGE_NAME)" ]; then
      docker rmi $BUILD_BASE_IMAGE_NAME
    fi
    docker commit $BUILD_BASE_CONTAINER_NAME $BUILD_BASE_IMAGE_NAME
    docker rm $BUILD_BASE_CONTAINER_NAME
  fi
elif [ $1 = "init2" ]; then
  docker run -it --name $BUILD_CONTAINER_NAME \
    --volume $PWD/$BUILD_DIR:/o2oa \
    --volume $PWD/tools:/tools \
    --workdir /o2oa \
    $BUILD_BASE_IMAGE_NAME \
    /tools/init2.sh
  read -p "Save Phase-2 image? (Y/n) " ans
  ans=${ans:-Y}
  if [ $ans = 'Y' ] || [ $ans = 'y' ]; then
    if [ -n "$(docker images -q $BUILD_IMAGE_NAME)" ]; then
      docker image rm $BUILD_IMAGE_NAME
    fi
    docker commit $BUILD_CONTAINER_NAME $BUILD_IMAGE_NAME
    docker rm $BUILD_CONTAINER_NAME
    docker rmi $BUILD_BASE_IMAGE_NAME
  fi
elif [ $1 = "build" ]; then
  docker run -it --rm \
    --volume $PWD/$BUILD_DIR:/o2oa \
    --volume $PWD/tools:/tools \
    --workdir /o2oa \
    --env JAVA_HOME=/o2oa/o2server/jvm/linux_java11 \
    $BUILD_IMAGE_NAME \
    /tools/build.sh
elif [ $1 = "run" ]; then
  docker run -it --rm --name $RUN_CONTAINER_NAME \
    --volume $PWD/$BUILD_DIR/target/o2server:/opt/o2server \
    --workdir /opt/o2server \
    --publish 127.0.0.1:80:80 \
    --publish 127.0.0.1:20020:20020 \
    --publish 127.0.0.1:20030:20030 \
    phusion/baseimage:master-amd64 \
    /bin/bash -c "apt-get update; apt-get install -y fontconfig; fc-cache --force; /opt/o2server/start_linux.sh"
elif [ $1 = "rm" ]; then
  rm -r $BUILD_DIR
elif [ $1 = "clear_src" ]; then
  for f in $(git status -s --ignored | grep "^\!\! $SRC_DIR/" | sed 's/!! //g'); do
    rm -rf $f;
  done
else
  usage
fi

exit 0
