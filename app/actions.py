__author__ = 'soms'

def check_card(reader, card_num):
    """
    Function sends server request to check grant access.
    :param reader: String, identifying card number
    :param card_num: String, identifying card number
    :return: True if access granted, False otherwise
    """
    return True

ACTIONS = {
    'check': check_card
}