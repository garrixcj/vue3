#!/bin/bash
# 複製需檢測檔案進 src
mkdir src
cp -R common src/common
cp -R custom src/custom
cp -R style src/style
cp -R utils src/utils

# 複製檢測環境設定
cp .gitlab-ci/env/.[^.]* .
cp .gitlab-ci/env/* .
