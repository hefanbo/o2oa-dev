#!/bin/bash
echo "DANGER! Files in this directory will be changed and can NOT be recovered."
read -p "Type \"yes\" to continue, type anything else to cancel: " ans
ans=${ans:-no}
if [ $ans = 'yes' ]; then
  echo "Pull files"
  rm -rf src
  mkdir src
  DIR=$PWD
  cd ../o2oa-src
  for FILE in $(cat ../patches/file_list.txt); do
    cp --parents $FILE ../patches/src
  done
  cd $DIR
else
  echo "Cancelled"
fi
