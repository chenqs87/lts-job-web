#!/usr/bin/env bash
yarn build
mv dist web
zip -r lts-job-web.zip ./web/*
rm -rf ./web
