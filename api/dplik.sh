#!/bin/bash
# cd /var/www/html/cron

wget https://plikplaski.mf.gov.pl/pliki//$(date +"%Y%m%d").7z

echo "downloaded";

7z x $(date +"%Y%m%d").7z

echo "unzipped";

rm $(date +"%Y%m%d").7z

echo "removed";

php loadVAT.php

echo "inserted";
echo "done";