$( document ).ready(function() {
    var context = canvas.getContext("2d");
    //var context2 = canvas1.getContext("2d");
    var shape = new Object(), g1 = new Object(), g2 = new Object(), g3 = new Object();
    var board = [];
    var board_copy = [];
    var score;
    var pac_color;
    var start_time;
    var time_elapsed;
    var interval = null;
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
    var food_remain = 20;
    var status = 0; //0 - not started, 1 - on going, 2 - win, 3 - lose, 4 = draw
    var ghosts = [new Image(),new Image(),new Image()], gs = [g1, g2, g3];
    var lives = 3;
    //var ghost4 = new Image();
    ghosts[0].src = "images/blue_ghost.gif";
    ghosts[1].src = "images/pink_ghost.gif";
    ghosts[2].src = "images/red_ghost.gif";
    g1.img = ghosts[0];
    g2.img = ghosts[1];
    g3.img = ghosts[2];
    //ghost4.src = "images/yellow_ghost.gif";
    var stack = [];
    var stack_ghosts = [];
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
        for(var i = 0; i < monsters; i++) {
            stack.push(ghosts[i]);
            stack_ghosts.push(gs[i]);
        }
    }

    function Start() {
        // w = window.innerWidth/2;
        // h = window.innerHeight/2;
        h = window.screen.height*0.7;
        timeleft = 0;
        board = getRandomBoard();
        status = score = 0;
        pac_color = "yellow";
        var cnt = 100;
        food_remain = 60;
        var pacman_remain = 1;
        canvas.height = h;
        canvas.width = h;
        ob_size = canvas.width / width;
        start_time = new Date();
        context = canvas.getContext("2d");
        if(interval != null)
            window.clearInterval(interval);
        setMonsters();
        var pc = findRandomEmptyCell(board);
        shape.i = pc[0];
        shape.j = pc[1];
        board[pc[0]][pc[1]] = 2;
        pacman_pos = [pc[0], pc[1]];

        for(var i = 0; i < monsters; i++)
        {
            var pos = findRandomCellFarFromPacman(board);
            board[pos[0]][pos[1]] = 3;
            gs[i].i = pos[0];
            gs[i].j = pos[1];
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
            board[emptyCell[0]][emptyCell[1]] = 4;
            food_remain--;
        }
        board_copy = new Array();
        for(var i = 0; i < height; i++)
        {
            board_copy[i] = new Array();
            for(var j = 0; j < width; j++)
                if(board[i][j] == 4)
                    board_copy[i][j] = board[i][j];
                else
                    board_copy[i][j] = 0;
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
        life.innerText = "Lives:\t"+lives;
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
                } else if (board[i][j] === 4) {
                    context.beginPath();
                    context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                } else if (board[i][j] === 1) {
                    context.beginPath();
                    context.rect(center.x - ob_size/2, center.y - ob_size/2, ob_size, ob_size);
                    context.strokeStyle = "blue"; //color
                    context.lineWidth = ob_size/12;
                    context.stroke();
                } else if (board[i][j] === 3) { // draw a ghost
                    // context.beginPath();
                    // context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    // context.fillStyle = "purple"; //color
                    // context.fill();
                    var ghost = getGhost(i, j);
                    context.drawImage(ghost.img,0,0,ghost.img.width,ghost.img.height,center.x-ob_size/2,center.y-ob_size/2,ob_size,ob_size);
                    stack_ghosts.push(ghost);
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

    function getGhost(i, j)
    {
        for(var n = 0; n < monsters; n++)
        {
            if(gs[n].i == i && gs[n].j == j)
                return gs[n];
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
            if (shape.j > 0 && board[shape.i][shape.j - 1] !== 1) {
                shape.j--;
            }
        }
        if (x === 2) {
            if (shape.j < height-1 && board[shape.i][shape.j + 1] !== 1) {
                shape.j++;
            }
        }
        if (x === 3) {
            if (shape.i > 0 && board[shape.i - 1][shape.j] !== 1) {
                shape.i--;
            }
        }
        if (x === 4) {
            if (shape.i < width-1 && board[shape.i + 1][shape.j] !== 1) {
                shape.i++;
            }
        }
        if (board[shape.i][shape.j] === 4) {
            score++;
        }
        if(board[shape.i][shape.j] == 3)
        {
            board[shape.i][shape.j] = 3;
            lives--;
            if(lives < 0)
                status = 3;
            else
            {
                var pos = findRandomEmptyCell(board);
                board[pos[0]][pos[1]] = 2;
                shape.i = pos[0];
                shape.j = pos[1];
            }
        }
        else board[shape.i][shape.j] = 2;
        var currentTime = new Date();
        time_elapsed = (currentTime - start_time) / 1000;
        time_elapsed = secondsToHms(~~time_elapsed);
        for(var i = 0; i < monsters; i++)
        {
            ghostMove(stack_ghosts[i]);
        }
        if (score >= 20 && time_elapsed <= 10) {
            pac_color = "green";
        }
        if (score === 50) {
            window.clearInterval(interval);
            window.alert("Game completed");
        }
        else if(status == 3) {
            window.clearInterval(interval);
            window.alert("YOU LOST!");
        }
        else {
            Draw();
        }
    }

    function ghostMove(ghost)
    {
        board[ghost.i][ghost.j] = board_copy[ghost.i][ghost.j];
        semi_randomMove(ghost);
        board[ghost.i][ghost.j] = 3;
    }

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

    var boards = [];
    boards[0] = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,1,0],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
        [0,1,0,1,0,1,1,1,0,0,0,0,1,1,1,0,1,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,0],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
        [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
        [0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,1,1,0,0,0,0,1,1,1,0,1,0,1,0],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
        [0,1,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    boards[1] = [
        [0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
        [0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    boards[2] = [
        [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,1,0,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,0],
        [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0],
        [0,1,1,1,0,1,1,0,1,0,0,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0],
        [1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0],
        [0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,1,0,0,0,1,1,1,0,1,1,1,1,1,1,0,0,1,0,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,1,0,1],
        [0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0],
        [0,1,1,1,0,0,0,1,0,0,1,0,0,1,0,0,0,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    function getRandomBoard()
    {
        var n = Math.random()*boards.length;
        return cleanBoard(boards[Math.floor(n)]);
    }

    function cleanBoard(board)
    {
        for(var i = 0; i < height; i++)
        {
            for(var j = 0; j < width; j++)
            {
                if(board[i][j] !== 1)
                    board[i][j] = 0;
            }
        }
        return board;
    }

    function randomMove(moving_object) {
        var rand=Math.random();
        if(rand<0.25){
            if (moving_object.j > 0 && board[moving_object.i][moving_object.j - 1] !== 1) {
                moving_object.j--;
            }
        }
        else if(rand<0.5){
            if (moving_object.j < height-1 && board[moving_object.i][moving_object.j + 1] !== 1)
                moving_object.j++;
        }
        else if(rand<0.75){
            if (moving_object.i > 0 && board[moving_object.i - 1][moving_object.j] !== 1)
                moving_object.i--;
        }
        else{
            if (moving_object.i < width-1 && board[moving_object.i + 1][moving_object.j] !== 1)
                moving_object.i++;
        }
    }

    function semi_randomMove(ghost_object){
        var rand = Math.random();
        if(rand < 0.05) randomMove(ghost_object);
        else if(rand<0.9)
            bestWay2pacMan(ghost_object,false);
        else
            bestWay2pacMan(ghost_object,true);
    }

    function bestWay2pacMan(ghost_object,far) {
        var arr = [];
        if (ghost_object.j > 0 && board[ghost_object.i][ghost_object.j - 1] !== 1)
            arr[0] = ManhattanDist(ghost_object.i, ghost_object.j - 1, shape.i, shape.j);
        if (ghost_object.j < height - 1 && board[ghost_object.i][ghost_object.j + 1] !== 1)
            arr[1] = ManhattanDist(ghost_object.i, ghost_object.j + 1, shape.i, shape.j);
        if (ghost_object.i > 0 && board[ghost_object.i - 1][ghost_object.j] !== 1)
            arr[2] = ManhattanDist(ghost_object.i - 1, ghost_object.j, shape.i, shape.j);
        if (ghost_object.i < width - 1 && board[ghost_object.i + 1][ghost_object.j] !== 1)
            arr[3] = ManhattanDist(ghost_object.i + 1, ghost_object.j, shape.i, shape.j);
        if(far) {
            switch (arr.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)) {
                case 0:
                    ghost_object.j--;
                    break;
                case 1:
                    ghost_object.j++;
                    break;
                case 2:
                    ghost_object.i--;
                    break;
                case 3:
                    ghost_object.i++;
                    break;
            }
        }
        else{
            switch (arr.reduce((iMin, x, i, arr) => x > arr[iMin] ? i : iMin, 999)) {
                case 0:
                    ghost_object.j--;
                    break;
                case 1:
                    ghost_object.j++;
                    break;
                case 2:
                    ghost_object.i--;
                    break;
                case 3:
                    ghost_object.i++;
                    break;
            }
        }
    }
    /**
     * @return {number}
     */
    function ManhattanDist(p1_x,p1_y,p2_x,p2_y){
        return Math.abs(p1_x-p2_x) + Math.abs(p1_y-p2_y);
    }
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }
    }
});

/**

 [0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
 [0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,1,0,0,1,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
 [0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
 [0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,0,1,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
 [0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0],
 [0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0],
 [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

 **/