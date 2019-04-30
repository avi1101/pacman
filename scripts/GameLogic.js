$( document ).ready(function() {
    var context = canvas.getContext("2d");
    //var context2 = canvas1.getContext("2d");
    var shape = new Object();
    var board;
    var score;
    var pac_color;
    var start_time;
    var time_elapsed;
    var interval;
    var login = false;
    var timeleft = 0;
    var downloadTimer = null;
    var monsters = 3;
    var pacman_pos = [];
    var fruits = 4;
    var width = 20;
    var height = 20;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var ob_size = 0;
    var mouth = 0;
    var upKey = "38";
    var ghosts = [new Image(),new Image(),new Image()];
    //var ghost4 = new Image();
    ghosts[0].src = "images/blue_ghost.gif";
    ghosts[1].src = "images/pink_ghost.gif";
    ghosts[2].src = "images/red_ghost.gif";
    //ghost4.src = "images/yellow_ghost.gif";
    var stack = [];
    //stack.push(ghost4);
    //Start();
    //Draw();
    $('#canvas').height(window.screen.height*0.7);
    $('#canvas').width(window.screen.height*0.7);
    $('#start_game_btn').click(function(){
        Start();
    });

    function setMonsters()
    {
        for(var i = 0; i < monsters; i++)
            stack.push(ghosts[i]);
    }

    function Start() {
        // w = window.innerWidth/2;
        // h = window.innerHeight/2;
        h = window.screen.height*0.7;
        alert("w = "+w+"\nh = "+h);
        timeleft = 0;
        board = new Array();
        score = 0;
        pac_color = "yellow";
        var cnt = 100;
        var food_remain = 20;
        var pacman_remain = 1;
        canvas.height = h;
        canvas.width = h;
        ob_size = canvas.width / width;
        start_time = new Date();
        setMonsters();
        for (var i = 0; i < height; i++) {
            board[i] = new Array();
            //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
            // 0 = nothing, 1 = food, 2 = pacman, 3 = ghost maybe, 4 = wall, 5 = fruit, 6 = poison
            for (var j = 0; j < width; j++) {
                if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                    board[i][j] = 4;
                } else {
                    var randomNum1 = Math.random()*9;
                    if(randomNum1 > 7){
                        board[i][j] = 4;
                        continue;
                    }
                    var randomNum = Math.random();
                    if (randomNum <= 1.0 * food_remain / cnt) {
                        food_remain--;
                        board[i][j] = 1;
                    } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                        shape.i = i;
                        shape.j = j;
                        pacman_remain--;
                        board[i][j] = 2;
                        pacman_pos = [i, j];
                    } else {
                        board[i][j] = 0;
                    }
                    cnt--;
                }
            }
        }
        for(var i = 0; i < monsters; i++)
        {
            var pos = findRandomCellFarFromPacman(board);
            board[pos[0]][pos[1]] = 3;
        }
        for(var i = 0; i < fruits; i++)
        {
            var pos = findRandomEmptyCell(board);
            var isPoison = Math.floor(Math.random() * 10) > 7;
            if(isPoison)
                board[pos[0]][pos[1]] = 6;
            else
                board[pos[0]][pos[1]] = 5;
        }
        while (food_remain > 0) {
            var emptyCell = findRandomEmptyCell(board);
            board[emptyCell[0]][emptyCell[1]] = 1;
            food_remain--;
        }
        keysDown = {};
        addEventListener("keydown", function (e) {
            keysDown[e.code] = true;
        }, false);
        addEventListener("keyup", function (e) {
            keysDown[e.code] = false;
        }, false);
        interval = setInterval(UpdatePosition, 100);
    }

    function findRandomEmptyCell(board) {
        var i = Math.floor((Math.random() * height - 1) + 1);
        var j = Math.floor((Math.random() * width - 1) + 1);
        while (board[i][j] !== 0) {
            i = Math.floor((Math.random() * height - 1) + 1);
            j = Math.floor((Math.random() * width - 1) + 1);
        }
        return [i, j];
    }

    function findRandomCellFarFromPacman(board)
    {
        var pos = findRandomEmptyCell(board);
        while(Math.abs(pos[0] - pacman_pos[0]) < 7 || Math.abs(pos[1] - pacman_pos[1]) < 7)
        {
            pos = findRandomEmptyCell(board);
        }
        return pos;
    }

    /**
     * @return {number}
     */
    function GetKeyPressed() {
        if (keysDown['ArrowUp']) {
            return 1;
        }
        if (keysDown['ArrowDown']) {
            return 2;
        }
        if (keysDown['ArrowLeft']) {
            return 3;
        }
        if (keysDown['ArrowRight']) {
            return 4;
        }
    }

    function Draw() {
        var ghost = 1;
        context.clearRect(0, 0, canvas.width, canvas.height); //clean board
        lblScore.innerText = "Score:\t"+score;
        lblTime.innerText = "Time:\t"+time_elapsed;
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var center = new Object();
                center.x = i * ob_size + ob_size/2; //600x600
                center.y = j * ob_size + ob_size/2;
                if (board[i][j] === 2) {
                    context.beginPath();
                    if(mouth < 2)
                        context.arc(center.x, center.y, ob_size/2, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                    else
                        context.arc(center.x, center.y, ob_size/2, 0 * Math.PI, 2 * Math.PI);
                    mouth += 1;
                    if(mouth == 4)
                        mouth = 0;
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + ob_size/12, center.y - ob_size/4, ob_size/12, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (board[i][j] === 1) {
                    context.beginPath();
                    context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                } else if (board[i][j] === 4) {
                    context.beginPath();
                    context.rect(center.x - ob_size/2, center.y - ob_size/2, ob_size, ob_size);
                    context.fillStyle = "grey"; //color
                    context.fill();
                } else if (board[i][j] === 3) { // draw a ghost
                    // context.beginPath();
                    // context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    // context.fillStyle = "purple"; //color
                    // context.fill();
                    var ghost = stack.shift();
                    context.drawImage(ghost,0,0,ghost.width,ghost.height,center.x - ob_size,center.y - ob_size,ob_size,ob_size);
                    stack.push(ghost);
                } else if (board[i][j] === 5){
                    context.beginPath();
                    context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    context.fillStyle = "red"; //color
                    context.fill();
                }
                else if (board[i][j] === 6){
                    context.beginPath();
                    context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    context.fillStyle = "green"; //color
                    context.fill();
                }
            }
        }
    }

    /*
    keysDown['ArrowUp'] = 1
    keysDown['ArrowDown'] = 2
    keysDown['ArrowLeft'] = 3
    keysDown['ArrowRight'] = 4
     */
    function UpdatePosition() {
        board[shape.i][shape.j] = 0;
        var x = GetKeyPressed();
        if (x === 1) {
            if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
                shape.j--;
            }
        }
        if (x === 2) {
            if (shape.j < height-1 && board[shape.i][shape.j + 1] !== 4) {
                shape.j++;
            }
        }
        if (x === 3) {
            if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
                shape.i--;
            }
        }
        if (x === 4) {
            if (shape.i < width-1 && board[shape.i + 1][shape.j] !== 4) {
                shape.i++;
            }
        }
        if (board[shape.i][shape.j] === 1) {
            score++;
        }
        board[shape.i][shape.j] = 2;
        var currentTime = new Date();
        time_elapsed = (currentTime - start_time) / 1000;
        time_elapsed = secondsToHms(~~time_elapsed);
        if (score >= 20 && time_elapsed <= 10) {
            pac_color = "green";
        }
        if (score === 50) {
            window.clearInterval(interval);
            window.alert("Game completed");
        } else {
            Draw();
        }
    }

    // downloadTimer = setInterval(function(){
    //     document.getElementById("timerlbl").innerText = secondsToHms(timeleft);
    //     timeleft += 1;
    //     if(timeleft <= 0)
    //         clearInterval(downloadTimer);
    // }, 1000);
    //
    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return hDisplay + mDisplay + sDisplay;
    }
});