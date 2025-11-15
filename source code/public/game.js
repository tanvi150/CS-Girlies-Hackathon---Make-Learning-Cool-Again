var canvas;
var clouds = []
var boards = [];
var Char_x;
var Char_y;
var swing = 0;
var swingDir = 1;
var going_right;
var Mark;
var groundLevel;
var step;
var coinCollected;
var movingChar = false;
function setup(){
	var section = document.querySelector('.game-section');
    canvas = createCanvas(section.offsetWidth,section.offsetHeight);
	canvas.parent(section);
    noStroke();

	groundLevel = height - height * 0.1
	Mark = 0;
	step = width * 1/12;
	Char_x = width * 1/12;
	Char_y = groundLevel;
	coinCollected = false;
	
	going_right = false;
	clouds = 
    [
        { pos_x: width * 0.1,  pos_y: 50, scale: 0.9 },
        { pos_x: width * 0.5,  pos_y: 80, scale: 1.3 },
		{ pos_x: width * 0.9,  pos_y: 60, scale: 0.9 },
        
    ];

	boards.push(createBoard(width * 2/12, groundLevel, 4, groundLevel * 0.2, 50, groundLevel*0.05,1))
	boards.push(createBoard(width * 3/12, groundLevel, 4, groundLevel * 0.2, 50, groundLevel*0.05,2))
	boards.push(createBoard(width * 4/12, groundLevel, 4, groundLevel * 0.2, 50, groundLevel*0.05,3))
	boards.push(createBoard(width * 5/12, groundLevel, 4, groundLevel * 0.2, 50, groundLevel*0.05,4))
	boards.push(createBoard(width * 6/12, groundLevel, 4, groundLevel * 0.2, 50, groundLevel*0.05,5))
	boards.push(createBoard(width * 7/12, groundLevel, 4, groundLevel * 0.2, 50, groundLevel*0.05,6))
	boards.push(createBoard(width * 8/12, groundLevel, 4, groundLevel * 0.2, 50, groundLevel*0.05,7))
	boards.push(createBoard(width * 9/12, groundLevel, 4, groundLevel * 0.2, 50, groundLevel*0.05,8))
	boards.push(createBoard(width * 10/12, groundLevel, 4, groundLevel * 0.2, 50, groundLevel*0.05,9))
  
}


function draw(){
    background(204, 204, 255);
    drawGround();
    drawClouds();
	
	drawStartFlag();
	drawEndFlag();
	drawBoards();
	moveCharacter();
	drawMark();
	drawCoin();
	drawGameCharacter();
}

function drawGround()
{
    fill(88, 228, 167);
    rect(0, height - height * 0.1, width, height * 0.1)
}
function drawClouds()
{
    fill(255,255,255);
	noStroke()
    for (var i = 0; i < clouds.length; i++) 
	{
		const c  = clouds[i]
		//drawing each cloud- with three ellipses
		ellipse(
			c.pos_x,
			c.pos_y,
			80 * c.scale,
			40 * c.scale
		);
		ellipse(
			c.pos_x - 40 * c.scale,
			c.pos_y,
			50 * c.scale,
			20 * c.scale
		);
		ellipse(
			c.pos_x + 40 * c.scale,
			c.pos_y,
			50 * c.scale,
			20 * c.scale
		);
		//animating clouds to move in the horizonal direction(to the left)
		c.pos_x -=  0.4;	

		if(c.pos_x < -100) {
			c.pos_x = width + 100;
		}
	}
}

function drawGameCharacter()
{
	var gap = height * 0.05
	var headSize = height * 0.05;
	var bodyHeight = height * 0.08;
	var bodyWidth = headSize * 0.4;
	
	var bodyTop = groundLevel - bodyHeight - gap
	var head_y = bodyTop - headSize/2;
	
	swing += 0.05 * swingDir;
	if(swing >0.5 || swing < -0.5) swingDir *= -1;


	strokeWeight(2)
	stroke(0);
	fill(255);
	


	if(going_right)
	{
		ellipse(Char_x,head_y, headSize)
		rect(Char_x - bodyWidth/2, bodyTop, bodyWidth, bodyHeight)

		//Arms
		var armSwing = Math.sin(frameCount * 0.15) * 5;
		line(Char_x + bodyWidth/2, bodyTop + 10, Char_x + 20, bodyTop + 10 - armSwing)
		line(Char_x - bodyWidth/2, bodyTop + 10, Char_x -20 , bodyTop + 10 + armSwing)

		
		//Legs
		line(Char_x - bodyWidth/2, bodyTop + bodyHeight, Char_x - 12, bodyTop + bodyHeight + 28 )
		line(Char_x + bodyWidth/2, bodyTop + bodyHeight, Char_x + 12, bodyTop + bodyHeight + 28 );
	}
	else
	{
		//head
		ellipse(Char_x, head_y, headSize)
		//body
		rect(Char_x - bodyWidth/2, bodyTop, bodyWidth, bodyHeight)

		//Segments
		line(Char_x - 15, bodyTop + 5, Char_x - bodyWidth/2, bodyTop + 5);
		line(Char_x + 15, bodyTop + 5, Char_x + bodyWidth/2, bodyTop + 5);
		//Arms
		line(Char_x - 15, bodyTop + 5, Char_x - 15, bodyTop + 35 + swing * 5);
		line(Char_x + 15, bodyTop + 5, Char_x + 15, bodyTop + 35 - swing * 5);
		//Legs
		line(Char_x - 7, bodyTop + bodyHeight, Char_x - 7, bodyTop + bodyHeight + 20);
		line(Char_x + 7, bodyTop + bodyHeight, Char_x + 7, bodyTop + bodyHeight + 20);

	}	
}
function drawStartFlag()
{
	var flag_x = width * 1/12
	var flagHeight = groundLevel * 0.4

	fill(255)
	rect(flag_x, groundLevel - flagHeight, 5, flagHeight)

	fill(255,0,0)
	rect(flag_x + 5, groundLevel - flagHeight, 60, 30);

}

function drawEndFlag()
{
	var flag_x = width - width * 1/12
	var flagHeight = groundLevel * 0.4

	fill(255)
	rect(flag_x, groundLevel - flagHeight, 5, flagHeight)

	fill(255,200,0)
	rect(flag_x + 5, groundLevel - flagHeight, 60, 30);

	fill(255);
	
	textSize(15)
	text("Q: 10", flag_x + 35, groundLevel - flagHeight + 20)

}

function drawBoards()
{
	for(var i = 0; i < boards.length ; i++)
	{
		boards[i].draw()
	}
}

function createBoard(x,y,poleWidth, poleHeight, boardWidth, boardHeight,num)
{
	
	var p = {
		x: x,
		y: y,
		poleWidth: poleWidth,
		poleHeight: poleHeight,
		boardWidth: boardWidth,
		boardHeight: boardHeight,
		num: num,

		draw: function()
		{
			stroke(0);
			strokeWeight(1)
			//pole
			fill(112, 37, 0)
			rect(this.x - this.poleWidth/2, this.y - this.poleHeight, this.poleWidth, this.poleHeight)

			//board
			fill(112,37,0)
			rect(this.x - this.boardWidth/2, this.y - this.poleHeight- this.boardHeight,this.boardWidth, this.boardHeight)

			//text
			fill(255)
			textAlign(CENTER);
			textSize(15);
			text("Q: " + this.num,this.x, this.y - this.poleHeight - this.boardHeight/2 + 5)

		},
		checkContact: function()
		{
			 
			if  (dist(Char_x,Char_y,this.x, this.y) < 20)
			{
				milestoneReached = true;
			
			}
		}

	}
	return p;
}

function drawMark()
{
	var x = width - 100;
	var y = height * 0.1;
	
	fill(100)
	textSize(22);
	textAlign(CENTER);
	text("Your current mark: " + Mark, x,y)

}

function moveCharacter() {
	
	
	if (movingChar)
	{
		Char_x += step;
		going_right = true;
		Mark +=1
		movingChar = false;
	}
	
}
function windowResized() {
  var section = document.querySelector('.game-section');
  resizeCanvas(section.offsetWidth, section.offsetHeight);
  groundLevel = height - height * 0.1
  Char_y = groundLevel;
}

function drawCoin()
{ 

	var x = width - width/12
	var y = groundLevel
	var coin_size = 30

	if(coinCollected == false)
	{
		fill(200,0,100)
		stroke(255,255,0)
		ellipse(x,y - coin_size/2, coin_size)

		textAlign(CENTER);
		text("$", x, y - coin_size/4)
	}
	
	if(dist(x,y,Char_x,Char_y) < coin_size)
	{
    if (!coinCollected) {
        coinCollected = true;	
        textSize(30);
        textAlign(CENTER);
        text("Coin collected! Level completed!" , width/2, height/2);

        // Update progress for this level
        updateProgressTracker(1);

        // Redirect to map.html after a short delay
        setTimeout(() => {
            window.location.href = "map.html";
        }, 2000);
            }
    } 

}

function resetCharacter() {
    Char_x = width * 1/12;
    Char_y = groundLevel;
    going_right = false;
}

function updateProgressTracker(levelNumber) {
    const now = new Date().toLocaleDateString();

    // Get latest uploaded file name (stored by upload.js)
    let uploadedFile = localStorage.getItem("lastUploadedFile");
    if (!uploadedFile) uploadedFile = "Unknown PDF";

    // Get current progress
    let progress = JSON.parse(localStorage.getItem("gameProgress")) || [];

    
    let levelIndex = progress.findIndex(p => p.level == levelNumber);

    if (levelIndex !== -1) {
        // Update existing level entry
        progress[levelIndex].completed = true;
        progress[levelIndex].date = now;
        progress[levelIndex].pdf = uploadedFile;
    } else {
        // Add new entry
        progress.push({
            level: levelNumber,
            completed: true,
            date: now,
            pdf: uploadedFile
        });
    }

    // Save updated progress
    localStorage.setItem("gameProgress", JSON.stringify(progress));
}