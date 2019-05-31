#!/usr/bin/env bash
npm run build
mv dist web
zip -r lts-job-web.zip ./web/*
rm -rf ./web
