import requests
import re
import random
session = requests.Session()
res = session.get('http://127.0.0.1:5000/register')
csrf = re.search(r'value="([^"]+)"\s+name="csrf_token"', res.text) or re.search(r'name="csrf_token"\s+value="([^"]+)"', res.text)
csrf = csrf.group(1)
payload = {'csrf_token': csrf, 'name': 'Test', 'email': f'test{random.randint(1,999)}@example.com', 'password': 'password123'}
res2 = session.post('http://127.0.0.1:5000/register', data=payload)
print(res2.status_code)
print(res2.url)
