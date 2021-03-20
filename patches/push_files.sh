#!/bin/bash
echo "DANGER! Files in the source directory will be changed and can NOT be recovered."
read -p "Type \"yes\" to continue, type anything else to cancel: " ans
ans=${ans:-no}
if [ $ans = 'yes' ]; then
  echo "Push files"
  DIR=$PWD
  cd src
  for FILE in $(cat ../file_list.txt); do
    cp --parents $FILE ../../o2oa-src
  done
  cd $DIR
else
  echo "Cancelled"
fi
