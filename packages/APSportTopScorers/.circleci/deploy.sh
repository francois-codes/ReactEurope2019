#!/bin/bash

ci_branch=$1

function deploy_master {
  npm run deploy
  exit_if_push_failed
}

function deploy_staging {
  npm run deploy:staging
  exit_if_push_failed
}

function skip_build {
  echo $ci_branch 
  echo 'is not a deployment branch. Skipping deployment to S3 step.'
}

function exit_if_push_failed {
  ERROR_CODE=$?
  if [ "$ERROR_CODE" != 0 ]
  then
    echo "push failed, exiting script"
    exit $ERROR_CODE
  fi
}

case $ci_branch in
"master")
  deploy_master 
  ;;
"staging")
  deploy_staging
  ;;
*)
  skip_build
  ;;
esac