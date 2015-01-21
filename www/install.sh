#!/bin/sh

. ../setenv.sh

# yum install php-intl

#php ./admin/genconfig.php

mkdir -p $INSTALL_PATH
cp -rv * $INSTALL_PATH
chown -R apache $INSTALL_PATH
chmod -R a+rw $INSTALL_PATH

for p in `find $INSTALL_PATH -type d -name .git -or -name .idea`; do
	rm -rf $p
done

rm -f $INSTALL_PATH/{*.sh,*.zip,*.html}
