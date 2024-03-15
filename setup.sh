#!/bin/sh
projectDir=$1
debug=$2
cd "$projectDir" || exit
npm install
echo "project dir is $projectDir, debug enabled is $debug"

# shellcheck disable=SC2039
if [ "$debug" == "true" ]; then
  npm run debug
else
  npm run prod
fi