var users ={};
users['a']={password: "a", firstName: "a", lastName: "a", email: "a@a.a.il", birthday: "01/01/70"};
var login = false;

function foo(){
    alert("works");
    var x = document.getElementById("email").value;
    if(x == "a")
        return true;
    return false;
}

$( document ).ready(function() {
    $('#reg1').submit(function(e){
        e.preventDefault(e);
    });
    $('#reg_btn').on('click', function() {
        $('#warnings').text("");
        var email = $('#email').val();
        var username = $('#username1').val();
        var password = $('#psw').val();
        var firstname = $('#firstname').val();
        var lastname = $('#lastname').val();
        var date = $('#datepicker').val();
        if(!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email))
        {
            $('#warnings').text("Email not valid");
            return;
        }
        if(!/^[a-zA-Z]+$/.test(firstname))
        {
            $('#warnings').text("First name not valid");
            return;
        }
        if(!/^[a-zA-Z]+$/.test(lastname))
        {
            $('#warnings').text("Last name not valid");
            return;
        }
        if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password))
        {
            $('#warnings').text("Password must contain at least 1 character and 1 digit and be 8 characters long");
            return;
        }
        if(username in users)
        {
            alert("Username "+username+" already exist!");
            return;
        }
        var details = {password: password, firstName: firstname, lastName: lastname, email: email, birthday: date};
        users[username] = details;
        alert("Registration Completed!\nYou may login now, Enjoy :)");
        $('#email').val("");
        $('#username1').val("");
        $('#psw').val("");
        $('#firstname').val("");
        $('#lastname').val("");
        $('#datepicker').val(null);
        return;
    });

});
function check_password(username,password)
{
    if(login)
    {
        login = false;
        document.getElementById("loginbtn").innerText = "Login";
        return;
    }
    if((username in users && users[username].password=== password))
        login=true;
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    if(!login){
        window.alert('Wrong username or password');
    }
    else
        {
            document.getElementById("loginbtn").innerText = "Disconnect";
            OpenGame();
        }
}