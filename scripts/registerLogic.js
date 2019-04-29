// function foo(){
//     alert("works");
//     var x = document.getElementById("email").value;
//     if(x == "a")
//         return true;
//     return false;
// }

$( document ).ready(function() {

    $( "#reg_btn" ).click(function() {
        $('#register').validate({  // initialize the plugin on your form.
            // rules, options, and/or callback functions
        });

        // trigger validity test of any element using the .valid() method.
        $('#email').valid();
        $('#psw').valid();
        $('#psw-repeat').valid();

        // the .valid() method also returns a boolean...
        if ($('#register').valid()) {
            // something to do if form is valid

        }
        alert("works");
    });
});