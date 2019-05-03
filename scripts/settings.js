var numballs = 60;
var gametime = 60;
var nummonsters = 2;
var upkey='ArrowUp';
var downkey ='ArrowDown';
var rightkey ='ArrowRight';
var leftkey ='ArrowLeft';
var color5 = "white";
var color15 = "orange";
var color25 = "red";
$( document ).ready(function() {
    $("#done").click(function () {

        numballs = $('#numballs').val();
        if (numballs < 50 || numballs > 90)
            numballs = (90 + 50) / 2;

        gametime = $('#gametime').val();
        if (gametime < 60)
            gametime = 60;
        nummonsters = $('#nummonsters').val();
        if (nummonsters < 1 || nummonsters > 3)
            nummonsters = 2;
        // what now?
        color5 = $('#cp5').val();
        color15 = $('#cp15').val();
        color25 = $('#cp25').val();
    });
    $("#randomVals").click(function () {
        numballs = Math.floor((Math.random() * 40) + 50);
        gametime = Math.floor((Math.random() * 300) + 60);
        nummonsters = Math.random() * 1000 + 60;
        color5 = "#" + Math.floor(Math.random() * 16777215).toString(16);
        color15 = "#" + Math.floor(Math.random() * 16777215).toString(16);
        color25 = "#" + Math.floor(Math.random() * 16777215).toString(16);
        document.getElementById("5color").value = color5;
        document.getElementById("15color").value = color15;
        document.getElementById("25color").value = color25;
        upkey= 'ArrowUp'; downkey ='ArrowDown'; rightkey ='ArrowRight';leftkey ='ArrowLeft';
        //what now?
    });


    var arr1 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
});

function updateUp() {
    $(document).keydown(function(event){
        upkey =  event.key;
        $(document).unbind();

        document.getElementById("up").innerText = upkey;
    });
}
function updateDown() {
    $(document).keydown(function(event){
        downkey =  (event.key);

        $(document).unbind();

        document.getElementById("down").innerText = downkey;
    });
}
function updateLeft() {
    $(document).keydown(function(event){
        leftkey =  (event.key);
        $(document).unbind();
        document.getElementById("left").innerText = leftkey;
    });
}
function updateRight() {
    $(document).keydown(function(event){
        rightkey =  (event.key);

        $(document).unbind();
        document.getElementById("right").innerText = rightkey;
    });

}