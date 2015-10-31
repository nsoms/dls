__author__ = 'soms'

import time
import threading

from config import Config
import RPi.GPIO as GPIO

from pi_server import Server
from net_check import NetCheck


def main():
    i = 0
    GPIO.setmode(GPIO.BOARD)

    for c in Config.devs:
        gpio_port = c.get('GPIO_port', None)
        if gpio_port is not None:
            print int(gpio_port)
            GPIO.setup(int(gpio_port), GPIO.OUT)
        srv = Server(c)
        srv.name = c.get('name', 'NONAME_' + str(i))
        srv.start()
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

