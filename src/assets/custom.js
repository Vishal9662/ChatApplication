const hidesignuporlogin = (value) => {
    let signup = document.getElementById("sign-up");
    let login = document.getElementById("login");
    if (value === "signup") {
        signup.style.display = "none";
        login.style.display = "block";
    } else {
        signup.style.display = "block";
        login.style.display = "none";
    }
};