__author__ = 'soms'

import time
import threading

from config import Config, devDict
import RPi.GPIO as GPIO

from pi_server import Server
from net_check import NetCheck
from face_rec_server import FaceRecServer
from face_sig_handler import RequestHandler, HandlerServer
import pyjsonrpc


def main():
    i = 0
    GPIO.setmode(GPIO.BOARD)


    h_srv = HandlerServer()
    h_srv.start()

    for c in Config.devs:
        gpio_port = c.get('GPIO_port', None)
        if gpio_port is not None:
            print int(gpio_port)
            GPIO.setup(int(gpio_port), GPIO.OUT)
        srv = Server(c)
        srv.name = c.get('name', 'NONAME_' + str(i))
        srv.start()

        fsrv = FaceRecServer(c)
        fsrv.name = c.get('name', 'NONAME_F' + str(i))
        # Save handler names for rpc execution
        devDict[fsrv.name] = fsrv
        i += 1

    srv = NetCheck()
    srv.name = 'NetworkChecker'
    srv.start()

    # Ctrl+C waiting
    while threading.active_count() > 0:
        time.sleep(1)

    GPIO.cleanup()

if __name__ == "__main__":
    main()

