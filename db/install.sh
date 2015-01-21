#!/bin/bash

. ../setenv.sh

#exit
echo 
echo "Creating '$DB' DB user. You will be promted for password..."
su - postgres -c "dropdb $DB"
su - postgres -c "dropuser $DB"
su - postgres -c "createuser -s -D -R -E $DB"

echo
echo "Creating '$DB' database..."
su - postgres -c "createdb -O $DB $DB"

psql -h localhost -f scheme.sql $DB $DB

# tests
#psql -h localhost -f test.sql $DB $DB
#pg_restore -F t -d $DB -U $DB att_bt_bst_courses2.tgz 
#exit

