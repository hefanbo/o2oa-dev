#!/bin/bash
set -e

usage() {
  me=$(basename "$0")
  echo "Usage: $me <command>"
  echo "Command list"
  echo "  update:      copy source code to the build directory"
  echo "  update_deps: copy dependencies to the build directory"
  echo "  init:        initialize and build"
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
BUILD_IMAGE_NAME="local/o2oa-build"
BUILD_CONTAINER_NAME="o2oa-build"
RUN_CONTAINER_NAME="o2oa-test"

if [ $1 = "update" ]; then
  rsync -r "$SRC_DIR"/ "$BUILD_DIR"/
elif [ $1 = "update_deps" ]; then
  tmp_dir=$(mktemp -d)
  cat deps/jvm.tar.gz.part* > $tmp_dir/jvm.tar.gz
  cat deps/commons.tar.gz.part* > $tmp_dir/commons.tar.gz
  mkdir -p $BUILD_DIR/o2server/jvm
  tar xzf $tmp_dir/jvm.tar.gz -C $BUILD_DIR/o2server/jvm
  tar xzf $tmp_dir/commons.tar.gz -C $BUILD_DIR/o2server
  rm -r $tmp_dir
  if [ -f deps/node_modules.tar.gz ]; then
    tar xzf deps/node_modules.tar.gz -C $BUILD_DIR
  fi
elif [ $1 = "init" ]; then
  docker run -it --name $BUILD_CONTAINER_NAME \
    --volume $PWD/$BUILD_DIR:/o2oa \
    --volume $PWD/tools:/tools \
    --workdir /o2oa \
    --env JAVA_HOME=/o2oa/o2server/jvm/linux \
    phusion/baseimage:master-amd64 \
    /tools/init.sh
  if [ -n "$(docker images -q $BUILD_IMAGE_NAME)" ]; then
    docker image rm $BUILD_IMAGE_NAME
  fi
  docker commit $BUILD_CONTAINER_NAME $BUILD_IMAGE_NAME
  docker rm $BUILD_CONTAINER_NAME
elif [ $1 = "build" ]; then
  docker run -it --rm \
    --volume $PWD/$BUILD_DIR:/o2oa \
    --volume $PWD/tools:/tools \
    --workdir /o2oa \
    --env JAVA_HOME=/o2oa/o2server/jvm/linux \
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
    /opt/o2server/start_linux.sh
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
