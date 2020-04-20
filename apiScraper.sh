#!/bin/bash
# To run this on a timer make sure you have
# 1. Bash terminal
# 2. Curl and Crontab installed
# 3. Run `crontab -e` to initalize a timed execution of this script
# 4. Type `* 3 * * * apiScraper.sh coinmarketcap` and save cron job
# 5. Make sure cron job is listed by running `crontab -l <user>`
# Note: To remove all cronjobs `crontab -r <user>`

url=https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?sort=volume_24h
api_key=a95be842-69ed-4794-93c5-46e4c278b53c
file_name=$1

# move to working directory
cd "${0%/*}"

# Get the data from API
curl -H "X-CMC_PRO_API_KEY: $api_key" -H "Accept: application/json" -G $url > $file_name

# Append timestamp
source=$file_name
cp -a -- "$source" "apiScraped/$source-$(date +"%y-%m-%d-%H:%M")"
rm $file_name

