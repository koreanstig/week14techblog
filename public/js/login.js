async function loginFormHandler(e) {

    e.preventDefault();

    const username = document.querySelector("#user-login").value.trim();
    const password = document.querySelector("#password-login").value.trim();

    if (email && password) {
        const response = await fetch("/api/users/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (response.ok) {
            document.location.replace("/");
        } else {
            alert(response.statusText);
        }
    }
}

async function signupFormHandler(e) {

    e.preventDefault();

    const username = document.querySelector("#username-signup").value.trim();
    const email = document.querySelector("#email-signup").value.trim();
    const password = document.querySelector("#password-signup").value.trim();

    if (username && email && password) {
        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
            }),
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (response.ok) {
            console.log(response);
        } else {
            alert(response.statusText);
        }
        const responseTwo = await fetch("/api/users/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (responseTwo.ok) {
            console.log(response, " Logged in successfully!");
            document.location.replace("/");
        } else {
            alert(response.statusText);
        }
    }
}


document.querySelector("#login-btn").addEventListener("click", loginFormHandler);
document.querySelector("#signup-btn").addEventListener("click", signupFormHandler);