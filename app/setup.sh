#!/bin/bash

DIR=/usr/local/bin/dls_serve
NAME=dls_server

cp -r ../app $DIR
echo "#!/usr/bin/env sh 
python $DIR/dls_serve.py" > /usr/local/bin/$NAME
chmod a+x /usr/local/bin/$NAME

cp dls_server /etc/init.d/