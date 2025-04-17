from django.test import TestCase
from accounts.models import User

class LoginTests(TestCase):
    def test_login_with_invalid_credentials(self):
        response = self.client.post('/login/', {'username': 'invalid', 'password': 'invalid'})
        self.assertEqual(response.status_code, 401)

    def test_login_with_empty_fields(self):
        response = self.client.post('/login/', {'username': '', 'password': ''})
        self.assertEqual(response.status_code, 400)

    def test_login_with_locked_account(self):
        user = User.objects.create_user(username='locked_user', password='password')
        user.is_active = False
        user.save()
        response = self.client.post('/login/', {'username': 'locked_user', 'password': 'password'})
        self.assertEqual(response.status_code, 403)

    def test_successful_login(self):
        user = User.objects.create_user(username='valid_user', password='password')
        response = self.client.post('/login/', {'username': 'valid_user', 'password': 'password'})
        self.assertEqual(response.status_code, 200)