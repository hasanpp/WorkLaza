
function getCSRFToken() {
    const csrfToken = document.cookie.split(';')
      .find(row => row.trim().startsWith('csrftoken='))
      .split('=')[1];
    return csrfToken;
  }
  
  const csrfToken = getCSRFToken();
  
  fetch('your-endpoint-url/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken  
    },
    body: JSON.stringify({
      data: 'your_data_here'
    })
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
  