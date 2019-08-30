__author__ = 'KL1 + VP1'

import pyjsonrpc
from functools import partial
import time
import threading
import sys
import serial
import RPi.GPIO as GPIO


from config import Config

# Abstraction for handling calls from face recognition system
class FaceRecServer:

    def check(self):
        """
        Function checks serial port is opened. If not - exits
        :return: nothing
        """
        if not self.ser.isOpen():
            print time.ctime(), "Serial port is not opened or locked! Exit."
            sys.exit(1)

    def send_gpio(self):
        """
        Function send signal to GPIO port with stored configuration
        :return:
        """
        gpio_port = self.config.get('GPIO_port', None)
        if gpio_port is not None:
            GPIO.output(int(gpio_port), 1)
            time.sleep(Config.sleep_delay)
            GPIO.output(int(gpio_port), 0)

            print time.ctime(), "Send signal to GPIO"

    # Init with given config
    def __init__(self, config):

        # store given config
        self.config = config
        
        # Set none name first 
        self.name = None
        
        # configure the serial connections (the parameters differs on the device you are connecting to)
        self.port = config.get('port', None)
        if self.port is None:
            print time.ctime(), self.name, "port is None. Exit"
            sys.exit(1)

        print time.ctime(), self.name, "Starting serving "
        self.ser = serial.Serial(
            port=self.port,
            baudrate=Config.boudrate,
            parity=serial.PARITY_ODD,
            stopbits=serial.STOPBITS_TWO,
            bytesize=serial.SEVENBITS
        )

        self.check()

    def __exit__(self, type, value, traceback):
        print time.ctime(), self.name, "Closing port " + self.port + "... ",
        if self.ser.isOpen():
            self.ser.close()
            print "closed"
        else:
            print "not opened"
        print time.ctime(), type, value, traceback




