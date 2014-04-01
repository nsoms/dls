__author__ = 'soms'

class Config:
    debug = True
    boudrate = 9600
    sleep_delay = 1
    devs = [
        {
            'name': 'Entrance',         # Name of reader
            'port': '/dev/ttyUSB0',     # Dev string
            'action': 'check',          # Callback function executed on card input
            'open': True,               # Send open signal to GPIO on True return from action func
            'GPIO_port': 7              # Number of GPIO port to send signal to
        }
    ]
