def test_login_with_empty_fields():
    response = login('', '')
    assert response.status_code == 400
    assert response.json() == {'error': 'Fields cannot be empty'}

def test_login_with_invalid_credentials():
    response = login('invalid_user', 'wrong_password')
    assert response.status_code == 401
    assert response.json() == {'error': 'Invalid credentials'}

def test_login_with_locked_account():
    lock_account('locked_user')
    response = login('locked_user', 'password123')
    assert response.status_code == 403
    assert response.json() == {'error': 'Account is locked'}

def test_successful_login():
    create_account('valid_user', 'password123')
    response = login('valid_user', 'password123')
    assert response.status_code == 200
    assert response.json() == {'message': 'Login successful'}