#!/bin/bash
set -e

npm run build:linux

if [ -d target ]; then
  find target/o2server/store/ -name "*.war" -printf "%f\n" > target/o2server/store/manifest.cfg
  find target/o2server/store/jars -name "*.jar" -printf "%f\n" > target/o2server/store/jars/manifest.cfg
  tar czf target/o2server.tar.gz -C target o2server
fi
