#!/bin/bash

DIR=/usr/local/bin/dls_serve
NAME=dls_server

rm -rf $DIR*

cp -rf ../app $DIR
echo "#!/bin/bash 
python $DIR/dls_serve.py" > /usr/local/bin/$NAME
chmod a+x /usr/local/bin/$NAME

cp dls_server /etc/init.d/
