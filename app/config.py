__author__ = 'soms'

# list of gprcio devices
devDict = {}

class Config:
    server_uri = '192.168.30.221'
    server_port = 80
    check_uri = 'https://%s/mt/check.php?action=%s&reader=%s&card=%s' 
    debug = True
    boudrate = 9600
    sleep_delay = 3
    check_delay = 5
    netcheck_timeout = 30   # timeout to check network state
    netcheck_status = True # status of the network connection
    devs = [
        {
            'name': 'Entrance',         # Name of reader
            'port': '/dev/ttyUSB0',     # Dev string
            'action': 'check',          # Callback function executed on card input
            'open': True,               # Send open signal to GPIO on True return from action func
            'GPIO_port': 7,             # Number of GPIO port to send signal to
            'failure_try': 10           # failure retries amount if in failed state
        }
    ]
