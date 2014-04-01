__author__ = 'soms'

import time
import serial
import sys
import threading

from config import Config
from actions import *
import RPi.GPIO as GPIO



class Server(threading.Thread):
    ser = None
    buf = ''
    port = ''
    config = None

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
        
            print "Send signal to GPIO"

    def check(self):
        """
        Function checks serial port is opened. If not - exits
        :return: nothing
        """

        if not self.ser.isOpen():
            print "Serial port is not opened or locked! Exit."
            sys.exit(1)

    def proceed_signal(self, in_str=None):
        """
        Proceeds input signal stored in self.buf or in in_str. Tries to find card number within string.
        Signals in input string:
           #S00             - self check signal
           #F002600A1477B   - card number
        :param in_str: If passed used instead of self.buf
        :return: Card number if it was found.
        """
        if in_str is not None:
            self.buf = in_str

        # check that signal begins with '#'
        if self.buf[0] != '#':
            print self.name, "Wrong signal. Continue"
            return

        # get signals from string - it could be concatenated signals
        signals = self.buf.split('#')

        # parse signals
        for s in signals:
            if s == '' or s is None:
                continue
            if s[0] == 'S':  # Autotest signal
                if Config.debug:
                    print self.name, 'Autotest'
                continue
            if s[0] == 'F':  # Card number signal
                card = s[3:]
                #if Config.debug:
                print self.name, "Card input: " + card
                self.proceed_card(card)

    def proceed_card(self, card):
        """
        Function by given config and card number executes appropriate request
        :param card: Card number
        :return: None
        """
        action = self.config.get('action', None)
        if action is None:
            return
        func = ACTIONS.get(action, None)
        if func is None:
            return
        print self.name, "Executing callback '" + action + "' with card " + card

        # execute callback function
        if func(self.name, card):
            print "Executed with ret val True"
            # check we should send signal to GPIO interface
            send_gpio = self.config.get('open', False)
            if send_gpio:
                self.send_gpio()
        else:
            print "Executed with ret val False"

    def process(self):
        while 1:
            self.buf = ''
            # let's wait one second before reading output (let's give device time to answer)
            time.sleep(0.5)
            while self.ser.inWaiting() > 0:
                self.buf += self.ser.read(1)

            if self.buf != '':
                self.proceed_signal()


    def __init__(self, config):
        # initialize parent class
        super(Server, self).__init__()
        #set thread daemonic
        self.daemon = True

        # store given config
        self.config = config

        # configure the serial connections (the parameters differs on the device you are connecting to)
        self.port = config.get('port', None)
        if self.port is None:
            print self.name, "port is None. Exit"
            sys.exit(1)

        print self.name, "Starting serving "
        self.ser = serial.Serial(
            port=self.port,
            baudrate=Config.boudrate,
            parity=serial.PARITY_ODD,
            stopbits=serial.STOPBITS_TWO,
            bytesize=serial.SEVENBITS
        )

        self.check()

    def __exit__(self, type, value, traceback):
        print self.name, "Closing port " + self.port + "... ",
        if self.ser.isOpen():
            self.ser.close()
            print "closed"
        else:
            print "not opened"
        print type, value, traceback

    def run(self):
        self.process()


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

    # Ctrl+C waiting
    while threading.active_count() > 0:
        time.sleep(1)

    GPIO.cleanup()

if __name__ == "__main__":
    main()

