#!/bin/sh
. ../setenv.sh
dump=$DB"_"`date +"%Y_%m_%d_%H_%M"`

echo $dump
pg_dump -Ft --username=$DB $DB -f $dump
tar czvf $dump.tar.gz $dump
rm -f $dump
mv $dump.tar.gz backup
