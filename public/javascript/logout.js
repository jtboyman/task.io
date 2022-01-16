//admin logout

async function adminLogout() {
  const response = await fetch("/api/admins/logout", {
    method: "post",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    alert(response.statusText);
  }
}

document.querySelector("#admin-logout").addEventListener("click", adminLogout);

//user logout

async function userLogout() {
  const response = await fetch("/api/users/logout", {
    method: "post",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    alert(response.statusText);
  }
}

document.querySelector("#user-logout").addEventListener("click", userLogout);
