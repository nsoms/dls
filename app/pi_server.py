__author__ = 'soms'

from actions import *
import time
import serial
import sys
import threading
import RPi.GPIO as GPIO

from config import Config

class Server(threading.Thread):
    ser = None
    buf = ''
    port = ''
    config = None
    last_card = ''
    last_action = None

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

    def check(self):
        """
        Function checks serial port is opened. If not - exits
        :return: nothing
        """

        if not self.ser.isOpen():
            print time.ctime(), "Serial port is not opened or locked! Exit."
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
            print time.ctime(), self.name, "Wrong signal. Continue"
            return

        # get signals from string - it could be concatenated signals
        signals = self.buf.split('#')

        # parse signals
        for s in signals:
            if s == '' or s is None:
                continue
            if s[0] == 'S':  # Autotest signal
                if Config.debug:
                    print time.ctime(), self.name, 'Autotest'
                continue
            if s[0] == 'F':  # Card number signal
                card = s[3:]
                print time.ctime(), self.name, "Card input: " + card
                self.proceed_card(card)

    def proceed_card(self, card):
        """
        Function by given config and card number executes appropriate request
        :param card: Card number
        :return: None
        """
        cur_time = time.time()
        if not self.last_card:
            self.last_card = ''
        if self.last_card is not None and self.last_time is not None and cur_time - self.last_time < Config.check_delay and self.last_card == card:
            if Config.debug:
                print time.ctime(), "Skip repeated card '", card, "' action (less then ", Config.check_delay, " seconds)"
            return

        self.last_time = cur_time
        self.last_card = card

        action = self.config.get('action', None)
        if action is None:
            return
        func = ACTIONS.get(action, None)
        if func is None:
            return
        print time.ctime(), self.name, "Executing callback '" + action + "' with card " + card

        # in failure state - just check should we open or not. In we should - then open for any card
        if not Config.netcheck_status:
            #print time.ctime(), self.name, "Network failure. Check config to open door."
            if self.config.get('open', False):
                print time.ctime(), self.name, "Network failure. Open door due to configuration"
                self.send_gpio()
            else:
                print time.ctime(), self.name, "Network failure. Not permitted to open door"
            return

        # execute callback function
        try:
            if func(self.name, card):
                print time.ctime(), "Executed with ret val True"
                # check we should send signal to GPIO interface
                if self.config.get('open', False):
                    self.send_gpio()
            else:
                print time.ctime(), "Executed with ret val False"
        except Exception as e:
            # if exception raised - then something goes wrong with network connection on smthn else.
            print time.ctime(), self.name, "Error executing callback: ", str(e), ". Check config to open door."
            if self.config.get('open', False):
                self.send_gpio()
            pass

    def process(self):
        while 1:
            self.buf = ''
            # let's wait one second before reading output (let's give device time to answer)
            time.sleep(0.5)
            while self.ser.inWaiting() > 0:
                self.buf += self.ser.read(1)

            if self.buf != '':
                self.proceed_signal()
            sys.stdout.flush()


    def __init__(self, config):
        # initialize parent class
        super(Server, self).__init__()
        self.last_card = None
        self.last_time = None
        #set thread daemonic
        self.daemon = True

        # store given config
        self.config = config

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

    def run(self):
        self.process()
