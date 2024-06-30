document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const userForm = document.getElementById("userForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem("loggedInUser", JSON.stringify(user));
                window.location.href = "options.html";
            } else {
                alert("Nome de usuário ou senha incorretos");
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("As senhas não coincidem");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.find(user => user.email === email)) {
                alert("Email já cadastrado");
                return;
            }

            const newUser = { username: name, email, password };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));

            alert("Usuário cadastrado com sucesso");
            window.location.href = "login.html";
        });
    }

    if (userForm) {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
            window.location.href = "login.html";
            return;
        }

        document.getElementById("name").value = loggedInUser.username;
        document.getElementById("email").value = loggedInUser.email;
        document.getElementById("password").value = loggedInUser.password;

        userForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            let users = JSON.parse(localStorage.getItem("users")) || [];
            users = users.map(user => user.email === loggedInUser.email ? { username: name, email, password } : user);
            localStorage.setItem("users", JSON.stringify(users));

            localStorage.setItem("loggedInUser", JSON.stringify({ username: name, email, password }));
            alert("Informações atualizadas com sucesso");
        });
    }
});
