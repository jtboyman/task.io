async function newFormHandler(event) {
    event.preventDefault();
  
    const team_name = document.querySelector('input[name="team-name"]').value;
    const team_description = document.querySelector('input[name="team-description"]').value;
  
    const response = await fetch(`/api/teams`, {
      method: 'POST',
      body: JSON.stringify({
        team_name,
        team_description
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/adminHome');
    } else {
      alert(response.statusText);
    }
  }
  
  document.querySelector('#new-team-form').addEventListener('submit', newFormHandler);