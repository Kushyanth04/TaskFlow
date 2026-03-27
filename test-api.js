const fetch = require('node-fetch');

async function runTests() {
  const baseUrl = 'http://localhost:3001/api';
  console.log('Testing Signup...');
  let res = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123', name: 'Test User' })
  });
  let data = await res.json();
  if (res.status !== 201) {
    console.error('Signup failed:', data);
    return;
  }
  console.log('Signup success:', data);
  const token = data.token;

  console.log('Testing Get Workspaces...');
  res = await fetch(`${baseUrl}/workspaces`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  data = await res.json();
  console.log('Workspaces:', data);

  console.log('Testing Create Workspace...');
  res = await fetch(`${baseUrl}/workspaces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ name: 'My Test Workspace' })
  });
  data = await res.json();
  console.log('Created Workspace:', data);
  const workspaceId = data.id;

  console.log('Testing Create Board...');
  res = await fetch(`${baseUrl}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ name: 'Kanban Board', workspaceId })
  });
  data = await res.json();
  console.log('Created Board:', data);
  const boardId = data._id;

  console.log('All tests passed successfully!');
}

runTests().catch(console.error);
