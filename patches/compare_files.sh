#!/bin/bash
DIRS=$(find src -mindepth 2 -maxdepth 2 -type d | sed "s|[^/]*\/||")
for DIR in $DIRS; do
  meld ../o2oa-src/$DIR src/$DIR &
done
