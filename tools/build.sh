#!/bin/bash
set -e

npm run build:linux

if [ -d target ]; then
  tar czf target/o2server.tar.gz -C target o2server
fi
