async function editFormHandler(event) {
    event.preventDefault();
    const team_name = document.querySelector('input[name="team-name"]').value.trim();
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    const response = await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        team_name
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/adminHome/');
    } else {
      alert(response.statusText);
    }

  }
  
  document.querySelector('.team-form').addEventListener('submit', editFormHandler);