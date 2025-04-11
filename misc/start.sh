#!/bin/bash
export NGINX_WEBAPI_SERVER=${WEBAPI__SERVER:="backend-4403-org-datuan.sy"}
export NGINX_MESSAGE_WEBAPI_SERVER=${MESSAGE_WEBAPI__SERVER:="gmc-outp-message.sy"}
export NGINX_SSO_SERVER=${SSO__Authority:="http://172.16.50.191:37717"}
export NGINX_TEMPLATE_SERVER=${TEMPLATE__SERVER:="172.16.127.100:29921"}
export NGINX_SYSMANAGEMENT__SERVER=${SYSMANAGEMENT__SERVER:="172.16.127.100:29918"}

smalte build --scope NGINX\.* \
    /etc/nginx/conf.d/app.conf.template:/etc/nginx/conf.d/app.conf

echo > /var/www/assets/env.js
echo "window.SSO__Authority='$SSO__Authority';window.EMRMAINTAINER__SERVER='$EMRMAINTAINER__SERVER';" >> /var/www/assets/env.js

# nginx
# tail -f /var/log/nginx/access.log -f /var/log/nginx/error.log

# Start the first process
nginx
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start my_first_process: $status"
  exit $status
fi

# Start the second process
tail -f /var/log/nginx/access.log -f /var/log/nginx/error.log
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start my_second_process: $status"
  exit $status
fi

# Naive check runs checks once a minute to see if either of the processes exited.
# This illustrates part of the heavy lifting you need to do if you want to run
# more than one service in a container. The container exits with an error
# if it detects that either of the processes has exited.
# Otherwise it loops forever, waking up every 60 seconds

while sleep 60; do
  ps aux |grep my_first_process |grep -q -v grep
  PROCESS_1_STATUS=$?
  ps aux |grep my_second_process |grep -q -v grep
  PROCESS_2_STATUS=$?
  # If the greps above find anything, they exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit 1
  fi
done
