
//constructor
var Vector2 = function ()
{
	this.x = 0;
	this.y = 0;
	this.DEGRAD = 0;
};

Vector2.prototype.initialize = function (x, y) 
{
  x = x;
  y = y;
};

Vector2.prototype.set = function (x, y) 
{
  x = x;
  y = y;
};
 
Vector2.prototype.getX = function () 
{
  return x;
};
 
Vector2.prototype.setX = function (x) 
{
  x = x;
};
 
Vector2.prototype.getY = function () 
{
  return y;
};
 
Vector2.prototype.setY = function (y) 
{
  y = y;
};

Vector2.prototype.magnitude = function()
{
	return Math.sqrt(x * x + y * y);
};

Vector2.prototype.normalize = function()
{
  var mag = Math.sqrt(x * x + y * y);
 
  if (mag === 0) {
    x = 0;
    y = 0;
  } else {
    x = x / mag;
    y = y / mag;
  }
};

Vector2.prototype.getNormalized = function () 
{
  var mag = Math.sqrt(x * x + y * y);
  return new Vector2(x / mag, y / mag);
};


//try dis
//Vector2.prototype.dot;
//Vector2.prototype.cross;