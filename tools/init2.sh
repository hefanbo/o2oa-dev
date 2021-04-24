#!/bin/bash
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
