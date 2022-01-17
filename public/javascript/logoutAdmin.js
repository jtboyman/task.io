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
