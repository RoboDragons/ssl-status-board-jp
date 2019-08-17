#!/bin/sh

set -e

# Build single binary (cmd/ssl-status-board/ssl-status-board)
# 
# Dependency: go yarn
#
# ~/.bashrc:
#   export GOPATH=~/go
#   export PATH="$PATH:$GOPATH/bin"

# UI
yarn install
yarn run build

# backend
go get -v -d ./...
cd cmd/ssl-status-board
go get -u -v github.com/gobuffalo/packr/packr
packr build
