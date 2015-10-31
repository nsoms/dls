__author__ = 'soms'

import threading
import time
import socket
from config import Config

class NetCheck(threading.Thread):

    addr = Config.server_uri
    port = Config.server_port
    #addr = '8.8.8.8'
    #port = 53

    def __init__(self):
        # initialize parent class
        super(NetCheck, self).__init__()
        self.last_time = None
        #set thread daemonic
        self.daemon = True

        print time.ctime(), self.name, "Starting checker "

    def __exit__(self, type, value, traceback):
        print time.ctime(), self.name, "Exiting checker "
        print time.ctime(), type, value, traceback

    def run(self):
        self.process()

    def process(self):
        while(1):
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.7)
                s.connect((NetCheck.addr, NetCheck.port))
                NetCheck.IP = s.getsockname()[0]
                if Config.netcheck_status == False:
                    print time.ctime(), self.name, "Network returned back to OK"
                Config.netcheck_status = True
            except Exception as e:
                Config.netcheck_status = False
                NetCheck.IP = '127.0.0.1'
                print time.ctime(), self.name, "FAILED!!!", str(e)
            finally:
                s.close()
            time.sleep(Config.netcheck_timeout)

def main():
    c = NetCheck()
    c.run()
    c.join()

if __name__ == "__main__":
    main() 
