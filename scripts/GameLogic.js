var interval = null;
var context = null;
var timeleft = 0;
var lives = 3;
var sound = null;
var score = 0;
var time_elapsed = 0;
$( document ).ready(function() {
    //var context2 = canvas1.getContext("2d");
    var shape = new Object(), g1 = new Object(), g2 = new Object(), g3 = new Object(), moving_bonus = new Object();
    var totalscore = 0;
    var move_object = true;
    var controls = [], invert_controls = [];
    var board = [];
    var isSlowMo = 0, isPoison = 0;
    var board_copy = [];
    var pac_color;
    var start_time;
    var login = false;
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
    var food_remain = 20;
    var status = 0; //0 - not started, 1 - on going, 2 - win, 3 - lose, 4 = draw
    var ghosts = [new Image(),new Image(),new Image()], gs = [g1, g2, g3];
    var ghost_delay = 1, poison_duraion = 0;
    var random_straight_walk = 0, ghostslowmo = 0, ghostdelayinterval = 2;
    var slowclock = new Image(), poisonimg = new Image();
    context = canvas.getContext("2d");
    //var ghost4 = new Image();
    moving_bonus.img = new Image();
    moving_bonus.img.src = "images/moving_candy.gif";
    slowclock.src = "images/clock.gif";
    poisonimg.src = "images/poison.gif";
    ghosts[0].src = "images/blue_ghost.gif";
    ghosts[1].src = "images/pink_ghost.gif";
    ghosts[2].src = "images/red_ghost.gif";
    g1.img = ghosts[0]; g1.direction = 1; //1 - right, 0 - left
    g2.img = ghosts[1]; g2.direction = 1;
    g3.img = ghosts[2]; g3.direction = 1;
    g1.fimg = new Image(); g1.fimg.src = "images/blue_ghost_rotateX.gif";
    g2.fimg = new Image(); g2.fimg.src = "images/pink_ghost_rotateX.gif";
    g3.fimg = new Image(); g3.fimg.src = "images/red_ghost_rotateX.gif";
    shape.direction = 1;
    //ghost4.src = "images/yellow_ghost.gif";
    var stack = [];
    var stack_ghosts = [];
    //stack.push(ghost4);
    //Start();
    //Draw();
    $('#canvas').height(window.screen.height*5/10);
    $('#canvas').width(window.screen.height*5/10);
    $('#start_game_btn').click(function(){
        // item1.style.listStyleImage = "url('images/clock.gif')";
        // item1.innerText = "Slow Motion";
        Start();
    });
    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    setMusic()
    function setMonsters()
    {
        for(var i = 0; i < monsters; i++) {
            stack.push(ghosts[i]);
            stack_ghosts.push(gs[i]);
        }
    }
    // 0 - nothing, 4 - food, 2 - pacman, 3 - ghost, 1 - wall, 5 - fruit, 6 - poison, 7 - moving bonus, 8 - mega fruit
    // 9 - slow mo clock
    // food =       5 points
    // fruit =      15 points
    // mega fruit = 25 points
    function Start() {
        sound.play();
        move_object = true;
        controls = [upkey, downkey, leftkey, rightkey];
        invert_controls = [downkey, upkey, rightkey, leftkey];
        isPoison = isSlowMo = false;
        ghostslowmo = 0;
        poison_duraion = 0;
        // w = window.innerWidth/2;
        // h = window.innerHeight/2;
        lives = 3;
        totalscore = 0;
        monsters = nummonsters;
        timeleft = gametime;
        food_remain = numballs;
        h = window.screen.height*7/10;
        board = getRandomBoard();
        status = score = 0;
        pac_color = "yellow";
        var pacman_remain = 1;
        canvas.height = h;
        canvas.width = h;
        ob_size = canvas.width / width;
        start_time = new Date();
        context = canvas.getContext("2d");
        messages = -1*ob_size*6;
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
        var f5 = food_remain*6/10;
        var f15 = food_remain*3/10;
        var f25 = food_remain*1/10;
        while (food_remain > 0) {
            while(f5 > 0)
            {
                var emptyCell = findRandomEmptyCell(board);
                board[emptyCell[0]][emptyCell[1]] = 4;
                food_remain--;
                f5--;
                totalscore += 5;
            }
            while(f15 > 0)
            {
                var emptyCell = findRandomEmptyCell(board);
                board[emptyCell[0]][emptyCell[1]] = 5;
                food_remain--;
                f15--;
                totalscore += 15;
            }
            while(f25 > 0)
            {
                var emptyCell = findRandomEmptyCell(board);
                board[emptyCell[0]][emptyCell[1]] = 8;
                food_remain--;
                f25--;
                totalscore += 25;
            }
            if(food_remain > 0) f5 = food_remain;

        }
        var moving_object = findRandomCellFarFromPacman(board);
        moving_bonus.i = moving_object[0];
        moving_bonus.j = moving_object[1];
        totalscore += 50;
        board[moving_object[0]][moving_object[1]] = 7;
        var poison = findRandomEmptyCell(board);
        board[poison[0]][poison[1]] = 6;
        var slowmo = findRandomEmptyCell(board);
        board[slowmo[0]][slowmo[1]] = 9;
        board_copy = new Array();
        for(var i = 0; i < height; i++)
        {
            board_copy[i] = new Array();
            for(var j = 0; j < width; j++)
                if(board[i][j] >= 4) {
                    if(board[i][j] == 7) continue;
                    board_copy[i][j] = board[i][j];
                }
                else
                    board_copy[i][j] = 0;
        }
        keysDown = {};
        addEventListener("keydown", function (e) {
            keysDown[e.key] = true;
        }, false);
        addEventListener("keyup", function (e) {
            keysDown[e.key] = false;
        }, false);
        interval = setInterval(UpdatePosition, 100);
    }

    function printboard(board, name)
    {
        var s = "";
        for(var i = 0; i < height; i++)
        {
            for(var j = 0; j < width; j++)
                s += board[i][j]+", ";
            s += '\n';
        }
        alert(name+":\n"+s);
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
        if (keysDown[controls[0]]) {
            return 1;
        }
        if (keysDown[controls[1]]) {
            return 2;
        }
        if (keysDown[controls[2]]) {
            return 3;
        }
        if (keysDown[controls[3]]) {
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
                    {
                        //directions: 1 = right, 0 = left, 3 = down, 2 = up
                        if(shape.direction == 0)
                            context.arc(center.x, center.y, ob_size/2, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                        else if(shape.direction == 1)
                            context.arc(center.x, center.y, ob_size/2, 1.15 * Math.PI, 2.85 * Math.PI);
                        else if(shape.direction == 2)
                            context.arc(center.x, center.y, ob_size/2, 0.7 * Math.PI, 2.35 * Math.PI);
                        else
                            context.arc(center.x, center.y, ob_size/2, -0.35 * Math.PI, 1.35 * Math.PI);
                    }
                    else
                        context.arc(center.x, center.y, ob_size/2, 0 * Math.PI, 2 * Math.PI);
                    mouth += 1;
                    if(mouth == 4)
                        mouth = 0;
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    if(shape.direction == 0)
                        context.arc(center.x + ob_size/12, center.y - ob_size/4, ob_size/12, 0, 2 * Math.PI); // circle
                    else if(shape.direction == 1)
                        context.arc(center.x - ob_size*1/12, center.y - ob_size*1/4, ob_size/12, 0, 2 * Math.PI); // circle
                    else if(shape.direction == 2)
                        context.arc(center.x + ob_size*1/4, center.y - ob_size/12, ob_size/12, 0, 2 * Math.PI); // circle
                    else
                        context.arc(center.x - ob_size/4, center.y - ob_size/12, ob_size/12, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (board[i][j] === 4) {
                    context.beginPath();
                    context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    context.fillStyle = color5; //color
                    context.fill();
                } else if (board[i][j] === 5) {
                    context.beginPath();
                    context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    context.fillStyle = color15; //color
                    context.fill();
                } else if (board[i][j] === 8) {
                    context.beginPath();
                    context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    context.fillStyle = color25; //color
                    context.fill();
                } else if (board[i][j] === 1) {
                    context.beginPath();
                    context.rect(center.x - ob_size/2, center.y - ob_size/2, ob_size, ob_size);
                    context.strokeStyle = "blue"; //color
                    context.lineWidth = ob_size/12;
                    context.stroke();
                } else if (board[i][j] === 7) {
                    context.drawImage(moving_bonus.img,0,0,moving_bonus.img.width,moving_bonus.img.height,center.x-ob_size/2,center.y-ob_size/2,ob_size,ob_size);
                }
                else if (board[i][j] === 6) {
                    context.drawImage(poisonimg,0,0,poisonimg.width,poisonimg.height,center.x-ob_size/2,center.y-ob_size/2,ob_size,ob_size);
                }
                else if (board[i][j] === 9) {
                    context.drawImage(slowclock,0,0,slowclock.width,slowclock.height,center.x-ob_size/2,center.y-ob_size/2,ob_size,ob_size);
                } else if (board[i][j] === 3) { // draw a ghost
                    // context.beginPath();
                    // context.arc(center.x, center.y, ob_size/4, 0, 2 * Math.PI); // circle
                    // context.fillStyle = "purple"; //color
                    // context.fill();
                    var ghost = getGhost(i, j);
                    var img;
                    if(ghost.direction == 1)
                        img = ghost.img;
                    else
                        img = ghost.fimg;
                    context.drawImage(img,0,0,ghost.img.width,ghost.img.height,center.x-ob_size/2,center.y-ob_size/2,ob_size,ob_size);
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
        if(isSlowMo)
        {
            context.beginPath();
            context.rect(10, 5, ob_size*6, ob_size); //x y control the stop
            context.strokeStyle = "blue"; //color
            context.lineWidth = 10;
            context.stroke();
            context.fillStyle = 'white';
            context.font = ob_size/2+'px Courier';
            context.fillText(`Slow Motion!`, ob_size + 5, ob_size*1.5/2 + 5);
            context.closePath();
        }
        if(isPoison)
        {
            context.beginPath();
            context.rect(canvas.width - 10 - ob_size*6, 5, ob_size*6, ob_size);
            context.strokeStyle = "green"; //color
            context.lineWidth = 10;
            context.stroke();
            context.fillStyle = 'white';
            context.font = ob_size/2+'px Courier';
            context.fillText(`Poisoned!`,   canvas.width - ob_size*6 + 50, ob_size*1.5/2 + 5);
            context.closePath();
        }
        //printboard(board,"board");
        //printboard(board_copy,"copy");
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
    directions: 1 = right, 0 = left, 3 = down, 2 = up
     */
    function UpdatePosition() {
        board_copy[shape.i][shape.j] = board[shape.i][shape.j] = 0;
        var eat = 0;
        var x = GetKeyPressed();
        if (x === 1) {
            if (shape.j > 0 && board[shape.i][shape.j - 1] !== 1) {
                shape.j--;
                shape.direction = 3;
            }
        }
        if (x === 2) {
            if (shape.j < height-1 && board[shape.i][shape.j + 1] !== 1) {
                shape.j++;
                shape.direction = 2;
            }
        }
        if (x === 3) {
            if (shape.i > 0 && board[shape.i - 1][shape.j] !== 1) {
                shape.i--;
                shape.direction = 1;
            }
        }
        if (x === 4) {
            if (shape.i < width-1 && board[shape.i + 1][shape.j] !== 1) {
                shape.i++;
                shape.direction = 0;
            }
        }
        if (board[shape.i][shape.j] === 4) {
            score += 5;
        }
        if (board[shape.i][shape.j] === 5) {
            score += 15;
        }
        if (board[shape.i][shape.j] === 8) {
            score += 25;
        }
        if (board[shape.i][shape.j] === 7) {
            score += 50;
            move_object = false;
        }
        else if(ghost_delay == 0) movingCandy();
        if (board[shape.i][shape.j] === 9) {
            ghostdelayinterval = 10;
            ghostslowmo = 100;
            isSlowMo = true;
        }
        if (board[shape.i][shape.j] === 6) {
            poison_duraion = 100;
            isPoison = true;
            pac_color = "green";
            for(var n = 0; n < 4; n++)
            {
                var t = controls[n];
                controls[n] = invert_controls[n];
                invert_controls[n] = t;
            }
        }
        if(board[shape.i][shape.j] == 3)
        {
            board[shape.i][shape.j] = 3;
            GhostEatPacman();
        }
        else board[shape.i][shape.j] = 2;
        var currentTime = new Date();
        time_elapsed = gametime - ((currentTime - start_time) / 1000);
        if(time_elapsed <= 0)
        {
            if(score < 150)
                endGame(2);
            else
                endGame(1);
        }
        time_elapsed = secondsToHms(~~time_elapsed);
        for(var i = 0; i < monsters && ghost_delay == 0; i++)
        {
            ghostMove(stack_ghosts[i]);
            if(stack_ghosts[i].i == shape.i && stack_ghosts[i].j == shape.j)
            {
                GhostEatPacman();
                eat++;
            }
        }
        if(ghost_delay == 0)
            ghost_delay = ghostdelayinterval;
        else
            ghost_delay--;
        if(ghostslowmo == 0) {
            ghostdelayinterval = 2;
            isSlowMo = false;
        }
        ghostslowmo--;
        if(isPoison)
        {
            if(poison_duraion == 0) {
                isPoison = false;
                pac_color = "yellow";
                for(var n = 0; n < 4; n++)
                {
                    var t = controls[n];
                    controls[n] = invert_controls[n];
                    invert_controls[n] = t;
                }
            }
            poison_duraion--;
        }
        if(score >= totalscore)
        {
            endGame(1);
        }
        else {
            Draw();
        }
    }
    function endGame(s)
    {
        window.clearInterval(interval);
        sound.pause();
        var endimage = new Image();
        if(s == 3)
        {
            endimage.src = "images/youlost.PNG";

        }
        else if(s == 2)
        {
            endimage.src = "images/youcandobetter.PNG";
        }
        else
        {
            endimage.src = "images/wehaveawinner.PNG";
        }
        endimage.onload = function() {

            context.drawImage(endimage,0,0,canvas.width,canvas.width);

        };

       //context.drawImage(endimage,endimage.width,endimage.height,10,canvas.width/4,canvas.width/2,canvas.width/2);
    }

    function GhostEatPacman()
    {
        lives--;
        if(lives < 0)
            endGame(3);
        else
        {
            var pos = findRandomEmptyCell(board);
            board[pos[0]][pos[1]] = 2;
            shape.i = pos[0];
            shape.j = pos[1];
        }

    }

    function ghostMove(ghost)
    {
        board[ghost.i][ghost.j] = board_copy[ghost.i][ghost.j];
        semi_randomMove(ghost);
        board[ghost.i][ghost.j] = 3;
    }

    function movingCandy()
    {
        if(!move_object) return;
        board[moving_bonus.i][moving_bonus.j] = board_copy[moving_bonus.i][moving_bonus.j];
        randomMove(moving_bonus);
        if(moving_bonus.i == shape.i && moving_bonus.j == shape.j)
        {
            move_object = false;
            score += 50;
        }
        else
            board[moving_bonus.i][moving_bonus.j] = 7;
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
            if (moving_object.j > 0 && board[moving_object.i][moving_object.j - 1] !== 1
                && board[moving_object.i][moving_object.j - 1] !== 3) {
                moving_object.j--;
            }
        }
        else if(rand<0.5){
            if (moving_object.j < height-1 && board[moving_object.i][moving_object.j + 1] !== 1
                && board[moving_object.i][moving_object.j + 1] !== 3)
                moving_object.j++;
        }
        else if(rand<0.75){
            if (moving_object.i > 0 && board[moving_object.i - 1][moving_object.j] !== 1
                && board[moving_object.i - 1][moving_object.j] !== 3) {
                moving_object.i--;
                moving_object.direction = 1;
            }
        }
        else{
            if (moving_object.i < width-1 && board[moving_object.i + 1][moving_object.j] !== 1
                && board[moving_object.i + 1][moving_object.j] !== 3) {
                moving_object.i++;
                moving_object.direction = 0;
            }
        }
    }

    function semi_randomMove(ghost_object){
        const rand = Math.random();
        if(rand < 0.05) randomMove(ghost_object);
        else if(rand<0.8)
            bestWay2pacMan(ghost_object,false);
        else
            bestWay2pacMan(ghost_object,true);
    }

    function bestWay2pacMan(ghost_object,far) {
        var arr = [-1,-1,-1,-1];
        if (ghost_object.j > 0 && board[ghost_object.i][ghost_object.j - 1] != 1
            && board[ghost_object.i][ghost_object.j - 1] != 3)
            arr[0] = ManhattanDist(ghost_object.i, ghost_object.j - 1, shape.i, shape.j);
        if (ghost_object.j < height - 1 && board[ghost_object.i][ghost_object.j + 1] != 1
            && board[ghost_object.i][ghost_object.j + 1] != 3)
            arr[1] = ManhattanDist(ghost_object.i, ghost_object.j + 1, shape.i, shape.j);
        if (ghost_object.i > 0 && board[ghost_object.i - 1][ghost_object.j] != 1
            && board[ghost_object.i - 1][ghost_object.j] != 3)
            arr[2] = ManhattanDist(ghost_object.i - 1, ghost_object.j, shape.i, shape.j);
        if (ghost_object.i < width - 1 && board[ghost_object.i + 1][ghost_object.j] != 1
            && board[ghost_object.i + 1][ghost_object.j] != 3)
            arr[3] = ManhattanDist(ghost_object.i + 1, ghost_object.j, shape.i, shape.j);
        var res = 0;
        if(far) {
            res = indexOfMaxOrMin(arr, false);
            switch (res) {
                case 0:
                    ghost_object.j--;
                    break;
                case 1:
                    ghost_object.j++;
                    break;
                case 2:
                    ghost_object.i--;
                    ghost_object.direction = 1;
                    break;
                case 3:
                    ghost_object.i++;
                    ghost_object.direction = 0;
                    break;
            }
        }
        else{
            res = indexOfMaxOrMin(arr, true);
            switch (res) {
                case 0:
                    ghost_object.j--;
                    break;
                case 1:
                    ghost_object.j++;
                    break;
                case 2:
                    ghost_object.i--;
                    ghost_object.direction = 1;
                    break;
                case 3:
                    ghost_object.i++;
                    ghost_object.direction = 0;
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

    function GhostBFS(ghost_object) {
        // var matrix = new Array();
        // for(var i = 0; i < board.length; i++)
        // {
        //     matrix = new Array();
        //     for(var j = 0; j < board[i].length; j++)
        //         matrix[i][j] = board[i][j];
        // }
        var path = findWay([ghost_object.i, ghost_object.j],[shape.i, shape.j], board);
        ghost_object.i = path[0];
        ghost_object.j = path[1];
    }
    function findWay(position, end, matrix) {
        var queue = [];

        //matrix[position[0]][position[1]] = 1;
        queue.push([position]); // store a path, not just a position

        while (queue.length > 0) {
            var path = queue.shift(); // get the path out of the queue
            var pos = path[path.length-1]; // ... and then the last position from it
            var direction = [
                [pos[0] + 1, pos[1]],
                [pos[0], pos[1] + 1],
                [pos[0] - 1, pos[1]],
                [pos[0], pos[1] - 1]
            ];

            for (var i = 0; i < direction.length; i++) {
                // Perform this check first:
                if (direction[i][0] == end[0] && direction[i][1] == end[1]) {
                    // return the path that led to the find
                    return path.concat([end]);
                }

                if (direction[i][0] < 0 || direction[i][0] >= matrix[0].length
                    || direction[i][1] < 0 || direction[i][1] >= matrix[0].length
                    || matrix[direction[i][0]][direction[i][1]] == 4
                    || matrix[direction[i][0]][direction[i][1]] == 3) {
                    continue;
                }

                //matrix[direction[i][0]][direction[i][1]] = 1;
                // extend and push the path on the queue
                return direction[i];
                queue.push(path.concat([direction[i]]));
            }
        }
    }


    function indexOfMaxOrMin(arr, minimum) {
        if (arr.length === 0) {
            return -1;
        }

        var store = arr[0];
        var maxIndex = 0;
        for(var i = 0; i < arr.length; i++) {
            if (arr[i] != -1) {
                store = arr[i];
                maxIndex = i;
                break;
            }
        }


        for (var i = 0; i < arr.length; i++) {
            if(arr[i] == -1) continue;
            if(!minimum) {
                if (arr[i] > store) {
                    maxIndex = i;
                    store = arr[i];
                }
            }
            else
            {
                if (arr[i] < store) {
                    maxIndex = i;
                    store = arr[i];
                }
            }
        }

        return maxIndex;
    }


});
function StopGame()
{
    sound.pause();
    if(interval != null)
        clearInterval(interval);
    lives = 3;
    time_elapsed = 0;
    score = 0;
    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.innerText = "Score:\t"+score;
    lblTime.innerText = "Time:\t"+time_elapsed;
    life.innerText = "Lives:\t"+lives;
}
function setMusic() {
    sound = document.createElement('audio');
    sound.setAttribute('src', "audio/music.mp3");
    sound.volume = 0.2;
}
function stopMusic() {
    if (null !== sound) {
        sound.pause();
        sound.currentTime = 0;
    }
}
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