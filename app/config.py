__author__ = 'soms'

class Config:
    server_uri = '192.168.30.221'
    check_uri = 'http://%s/mt/check.php?action=%s&reader=%s&card=%s' 
    debug = True
    boudrate = 9600
    sleep_delay = 5
    check_delay = 3
    default_failure_tries = 10
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
