import pyjsonrpc
import threading
from config import devDict
import time
import sys

class RequestHandler(pyjsonrpc.HttpRequestHandler):
    @pyjsonrpc.rpcmethod
    def get_grpcio_devs(self):
        """Method to get available devices names"""
        return devDict.keys()

    @pyjsonrpc.rpcmethod
    def open(self, a):
        """Open device by its name"""
	try:
            devDict[a].send_gpio()
            return True
        except:
            return False


# Server for handling rpc execution 
class HandlerServer(threading.Thread):
    def __init__(self, server_addr=('0.0.0.0', 9990), RequestHandlerClass=RequestHandler):
        super(HandlerServer, self).__init__()
        # Threading HTTP-Server
        self.http_server = pyjsonrpc.ThreadingHttpServer(
            server_address=server_addr,
            RequestHandlerClass=RequestHandlerClass
        )

        # set thread daemonic
        self.daemon = True

    def run(self):
        print "Starting HTTP server for RPC..."
        print "URL: ", self.http_server.server_address, ":", self.http_server.server_port
        self.http_server.serve_forever()

    def __exit__(self, type, value, traceback):
        print "Shutting down RPC server..."
        self.http_server.shutdown()
        print time.ctime(), type, value, traceback






