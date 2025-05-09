import unittest

class TestLogin(unittest.TestCase):
    def test_valid_login(self):
        self.assertTrue(login('valid_user', 'valid_password'))

    def test_invalid_username(self):
        self.assertFalse(login('invalid_user', 'valid_password'))

    def test_invalid_password(self):
        self.assertFalse(login('valid_user', 'invalid_password'))

    def test_empty_username(self):
        self.assertFalse(login('', 'valid_password'))

    def test_empty_password(self):
        self.assertFalse(login('valid_user', ''))

    def test_account_lockout(self):
        for _ in range(3):
            login('valid_user', 'invalid_password')
        self.assertFalse(login('valid_user', 'valid_password'))

if __name__ == '__main__':
    unittest.main()