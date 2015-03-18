#!/bin/sh
CURDIR="`dirname $0`"
pushd $CURDIR

. ../setenv.sh
dump=$DB"_"`date +"%Y_%m_%d_%H_%M"`
dump_sql=$dump"_sql"


echo $dump
pg_dump -Ft --username=$DB $DB -f $dump
tar czvf $dump.tar.gz $dump
pg_dump --username=$DB $DB -f $dump_sql
tar czvf $dump_sql.tar.gz $dump_sql
rm -f $dump $dump_sql
mv $dump.tar.gz backup
mv $dump_sql.tar.gz backup

pushd backup
MAILS=`cat maillist.txt`
cat message.txt | mail -s "School DB backup" -a $dump.tar.gz -a $dump_sql.tar.gz $MAILS
popd
popd
