//static file for the logic on the login page

async function signupFormHandler(event) { //async to wrap function
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && email && password) {
        //await assigned to variable, wont need .then to tell code what to do after promise completes
        const response = await fetch('/api/users', { //await before the promise
                method: 'post',
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
                headers: { 'Content-Type': 'application/json'}
            });

            //check the response status (replaces .catch w/ async/await)
            if (response.ok) {
                console.log('Success!');
            } else {
                alert(response.statusText);
            }
        }
    }

async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    const response = await fetch('/api/users/login', { //request different
      method: 'post',
      body: JSON.stringify({
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      document.location.replace('/dashboard'); //take us dashboard
    } else {
      alert(response.statusText); //tell u it messed up
    }
  }
}
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler); //remember no () here
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);