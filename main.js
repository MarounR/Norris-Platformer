var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var STATE_GAME = 1;
var STATE_RESET = 2;
var STATE_WIN = 3;
var gameState = STATE_GAME;

//var score = 0;
var lives = 3;

function runGame(deltaTime)
{
}

function runWin(deltaTime)
{
	context.fillStyle = "#000";
	context.font = "28px Arial";
	context.fillText("You WIN!!!!  Die to Reset", 200, 240);
}

function runReset(deltaTime)
{
}

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var LAYER_COUNT = 3;
var LAYER_BACKGOUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;

var METER = TILE;

var GRAVITY = METER * 9.8 * 6;

var MAXDX = METER * 10;
var MAXDY = METER * 15;

var ACCEL = MAXDX * 2;

var FRICTION = MAXDX * 6;

var JUMP = METER * 1500;

var tileset = document.createElement("img");
tileset.src = "tileset.png";

var keyboard = new Keyboard();
var player = new Player();

var cells = []; // the array that holds our simplified collision data

var music = new Howl(
{
		urls : ["background.ogg"],
		loop : true,
		buffer : true,
		volume : 0.5 
}
);
music.play()


var cells = []
function initialize() {
	for(var layerIndex = 0; layerIndex < LAYER_COUNT; layerIndex++) { // initialize the collision map
		cells[layerIndex] = [];
		var idx = 0;
			for(var y = 0; y < lvl1.layers[layerIndex].height; y++) {
				cells[layerIndex][y] = [];
					for(var x = 0; x < lvl1.layers[layerIndex].width; x++) {
					if(lvl1.layers[layerIndex].data[idx] != 0) {
						cells[layerIndex][y][x] = 1;
						cells[layerIndex][y-1][x] = 1;
						cells[layerIndex][y-1][x+1] = 1;
						cells[layerIndex][y][x+1] = 1;
				}
				else if(cells[layerIndex][y][x] != 1) {
					cells[layerIndex][y][x] = 0;
				}
				idx++;
			}
		}
	}
}

function cellAtPixelCoord(layer, x,y)
{
	if(x<0 || x>SCREEN_WIDTH || y<0)
		return 1;
	// let the player drop of the bottom of the screen (this means death)
	if(y>SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
	if(tx<0 || tx>=MAP.tw || ty<0)
		return 1;
	// let the player drop of the bottom of the screen (this means death)
	if(ty>=MAP.th)
		return 0;
	return cells[layer][ty][tx];
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
}

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
	
	// score
		//context.fillStyle = "yellow";
		//context.font="32px Arial";
		//var scoreText = "Score: " + score;
		//context.fillText(scoreText, SCREEN_WIDTH - 170, 35);
		
		// life counter
	context.fillStyle = "yellow";	
	context.font="32px Arial";
	var scoreText = "X: " + lives;
	context.fillText(scoreText, 80, 50)
	
	var heartImage =document.createElement("img")
	heartImage.src = "Heart.png"
	{
		context.drawImage(heartImage, 20, 10);
	}
	
	switch(gameState)
	{		
		case STATE_GAME:
			runGame(deltaTime);
			break;
		
		case STATE_WIN:
			runWin(deltaTime);
			break;
			
		case STATE_RESET:
			runReset(deltaTime);
			break;
	}
	drawMap();

	var width = -110;
	var height = -105;
	
	player.update(deltaTime);
	player.draw(context);
	
	if (player.position.y > 450)
	{
		player = new Player();
		gameState = STATE_RESET;
		lives = lives - 1;
		
	}
	
	if (lives < 0)
	{
		lives = 3;
	}
	
	if (player.position.x > 2000)
	{
		gameState = STATE_WIN;
	}
	
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	
	//X & Y
	context.fillStyle = "#fff";
	context.font="14px Arial";
	context.fillText("X: " + player.position.x, 5, 35, 100);
	context.fillStyle = "#fff";
	context.font="14px Arial";
	context.fillText("Y: " + player.position.y, 5, 50, 100);
}

initialize();

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
