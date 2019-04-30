$("#done").click(function () {

    var numballs = $('#numballs').val();
    if (numballs <50 || numballs > 90)
        numballs = (90+50)/2;

    var gametime = $('#gametime').val();
    if (gametime < 60 )
        gametime = 60;

    var nummonsters = $('#nummonsters').val();
    if (nummonsters <1 || nummonsters > 3)
        nummonsters = 2;
    /**
    var re = /[0-9A-Fa-f]{6}/g;
    var color5 = $('#5color').val();
    if (!re.test(color5.substring(1)) || 16777215>parseInt(color5.substring(1),16)|| parseInt(color5.substring(1),16)<0)
        color5 = "#"+Math.floor(Math.random()*16777215).toString(16);
    var color15 = $('#15color').val();
    if (!re.test(color15.substring(1)) || 16777215>parseInt(color15.substring(1),16)|| parseInt(color15.substring(1),16)<0)
        color5 = "#"+Math.floor(Math.random()*16777215).toString(16);
    var color25 = $('#25color').val();
    if (!re.test(color25.substring(1)) || 16777215>parseInt(color25.substring(1),16)|| parseInt(color25.substring(1),16)<0)
        color25 = "#"+Math.floor(Math.random()*16777215).toString(16);
    **/
    // what now?
});
$("#randomVals").click(function () {
    var numballs=Math.floor((Math.random() * 40) + 50);
    var gametime=Math.floor((Math.random() * 300) + 60);
    var nummonsters=Math.random()*1000+60;
    var color5="#"+Math.floor(Math.random()*16777215).toString(16);
    var color15="#"+Math.floor(Math.random()*16777215).toString(16);
    var color25="#"+Math.floor(Math.random()*16777215).toString(16);

    //what now?
});



var arr1= [
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
];