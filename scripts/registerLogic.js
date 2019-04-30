function foo(){
    alert("works");
    var x = document.getElementById("email").value;
    if(x == "a")
        return true;
    return false;
}

$( document ).ready(function() {
    $('#reg_btn').on('click', function() {
             var username = $('#email').val();
             var password = $('#psw').val();
             var firstname = $('#firstname').val();
             var lastname = $('#lastname').val();
             var date = $('#date').val();
             if(!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(username))
             {
                 $('#warnings').text("Email not valie");
                 return;
             }
             alert("workds");
    });

});