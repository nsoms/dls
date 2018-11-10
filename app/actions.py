__author__ = 'soms'

from config import Config
import urllib, json

def check_card(reader, card_num):
    """
    Function sends server request to check grant access.
    :param reader: String, identifying card number
    :param card_num: String, identifying card number
    :return: True if access granted, False otherwise
    """
    url = Config.check_uri % (Config.server_uri, 'check', reader, card_num)
    if Config.debug:
        print "Check function: sending request to ", url
    response = urllib.urlopen(url)
    data = json.loads(response.read())
    if Config.debug:
        print "Check function: received result is: ", data

    return data['access'] == u't'

ACTIONS = {
    'check': check_card
}
