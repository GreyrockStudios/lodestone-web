#!/bin/bash
set -e
cd /opt/lodestone-web
echo "Building web app..."
npx vite build
echo "Deploying to /var/www/lodestone..."
cp -r dist/* /var/www/lodestone/
echo "Done!"
