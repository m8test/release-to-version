#!/bin/sh
projectDir=$1
debug=$2
cd "$projectDir" || exit
npm install
echo "project dir is $projectDir, debug enabled is $debug"
# echo "sh=sh输出值" >> "$GITHUB_OUTPUT" # 输出值给 github actions
# shellcheck disable=SC2039
if [ "$debug" == "true" ]; then
  echo "run 'npm run debug'"
  npm run debug
else
  echo "run 'npm run prod'"
  npm run prod
fi