#!/bin/bash

. ../setenv.sh

version=`psql $DB $DB -c "select var_data from sysvariables where var_name='version'" | head -n 3 | tail -n 1 | sed 's/^ *//'`;
found=0;
echo "Version=$version;"
if [ "$version" = "(0 rows)" ]; then
    found=1;
fi;
for update in `cat updates.txt`; do
    echo -n "Update file: $update "
    if [ $found -eq 0 ]; then
        if [ ! -z `echo $update | grep $version` ]; then
            found=1;
            echo "... skipping"
            continue;
        else
            echo "... skipping"
            continue;
        fi;
    fi;
    echo "... applying";
    psql $DB $DB -f $update;
    echo "Finished update $update"
done;

#psql -h localhost -f functions.sql $DB $DB
#psql -h localhost -f roles.sql $DB $DB
#psql -h localhost -f groups.sql $DB $DB
#psql -h localhost -f users.sql $DB $DB
#psql -h localhost -f actions.sql $DB $DB

psql -h localhost -f functions.sql $DB $DB 2>&1 | egrep "ERR|ОШИБКА"
