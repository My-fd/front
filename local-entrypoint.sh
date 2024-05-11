#!/bin/bash
npm install next
yarn install
rm -rf .next/
yarn build
yarn start