//admin signup
async function adminSignupFormHandler(event) {
    event.preventDefault();
    const admin_name = document.querySelector('#admin-username-signup').value.trim();
    const email = document.querySelector('#admin-email-signup').value.trim();
    const password = document.querySelector('#admin-password-signup').value.trim();
  
    if (admin_name && email && password) {
      const response = await fetch('/api/admins', {
        method: 'post',
        body: JSON.stringify({
          admin_name,
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
          console.log("Success!");
      } else {
          alert(response.statusText);
      }
    }
  }

//admin login
async function adminLoginFormHandler(event) {
    event.preventDefault();
    const email = document.querySelector('#admin-email-login').value.trim();
    const password = document.querySelector('#admin-password-login').value.trim();
  
    if (email && password) {
      const response = await fetch('/api/admins/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
          document.location.replace('/');
      } else {
          alert(response.statusText);
      }
    }
  }

//user signup
async function userSignupFormHandler(event) {
    event.preventDefault();
    const username = document.querySelector('#user-username-signup').value.trim();
    const email = document.querySelector('#user-email-signup').value.trim();
    const password = document.querySelector('#user-password-signup').value.trim();
    const team_id = document.querySelector('#user-team-id').value.trim();
  
    if (username && email && password && team_id) {
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
          username,
          email,
          password,
          team_id
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
          console.log("Success!");
      } else {
          alert(response.statusText);
      }
    }
  }

//user login
async function userLoginFormHandler(event) {
    event.preventDefault();
    const email = document.querySelector('#user-email-login').value.trim();
    const password = document.querySelector('#user-password-login').value.trim();
  
    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
          document.location.replace('/');
      } else {
          alert(response.statusText);
      }
    }
  }


  document.querySelector('#admin-signup-form').addEventListener('submit', adminSignupFormHandler);
  document.querySelector('#user-signup-form').addEventListener('submit', userSignupFormHandler);
  document.querySelector('#admin-login-form').addEventListener('submit', adminLoginFormHandler);
  document.querySelector('#user-login-form').addEventListener('submit', userLoginFormHandler);