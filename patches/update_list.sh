#!/bin/bash
echo "WARNING! The file list will be updated according to this directory and can NOT be recovered."
read -p "Type \"yes\" to continue, type anything else to cancel: " ans
ans=${ans:-no}
if [ $ans = 'yes' ]; then
  echo "Update list"
  find src -type f | sed "s|[^/]*\/||" | sort > file_list.txt
else
  echo "Cancelled"
fi
