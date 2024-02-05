#!/bin/bash

ver=`cat server/base/app_ver.go | grep APP_VER | awk '{print $3}' | sed 's/"//g'`
echo $ver

#docker login -u chi-yuer

#docker build -t chi-yuer/anylink .

docker build -t chi-yuer/anylink --build-arg GitCommitId=$(git rev-parse HEAD) -f docker/Dockerfile .

docker tag chi-yuer/anylink:latest chi-yuer/anylink:$ver

exit 0

docker push chi-yuer/anylink:$ver
docker push chi-yuer/anylink:latest

