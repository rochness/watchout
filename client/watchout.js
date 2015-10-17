//constants
var highScore = 0;
var currentScore = 0;
var collisions = 0;
var numberOfEnemies = 10;
var canvasWidth = 1650; 
var canvasHeight = 700;
var radius = 10;
var transitionTime = 1000;
var collisionTime = 2000;
var audioEnabled = false;

var runClock = function(){
  setInterval(function(){
    d3.select('.current').select('span').text(currentScore++);
  }, 100);
}




var canvas = d3.select('.board').selectAll('svg')
                  .data([1])
                  .enter()
                  .append('svg')
                  .attr('width', canvasWidth)
                  .attr('height', canvasHeight)
                   .attr('viewBox', '0 0' + ' ' + canvasWidth + ' ' + canvasHeight);

function makePattern(imageName,imageTag) {
  canvas.append('defs').append('pattern')
                       .attr('id',imageTag)
                       .attr('patternUnits','objectBoundingBox')
                       .attr('width',radius*2)
                       .attr('height',radius*2)
                       .append('image')
                       .attr('xlink:href',imageName)
                       .attr('width',radius*2)
                       .attr('height',radius*2)
}                    



function createEnemies(numberOfEnemies) {
  var Enemy = function(x,y){
    this.x = x;
    this.y = y;
  }
  var enemies = [];
  for(var i = 0; i < numberOfEnemies; i++){
    var x = Math.random() * (canvasWidth - (radius * 2)) + radius;
    var y = Math.random() * (canvasHeight - (radius * 2)) + radius;
    enemies.push(new Enemy(x,y));
  }
  canvas.selectAll('.enemies')
                 .data(enemies)
                 .enter()
                 .append('circle')
                 .attr('cx', function(d){return d.x;})
                 .attr('cy', function(d){return d.y;})
                 .attr('r', radius)
                 .attr('class', 'enemies')
                 .attr('fill', 'url(#img1)');
}

function collisionDetection(enemy, callback) {
  var playerX = player.attr('cx');
  var playerY = player.attr('cy');
  var enemyX = enemy.attr('cx');
  var enemyY = enemy.attr('cy');
  var r = player.attr('r');
  var hypotenuse = Math.sqrt(Math.pow((playerX-enemyX), 2) + Math.pow((playerY-enemyY), 2));
  if(hypotenuse < r * 2){
    return true;
  }
  return false;
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function checkCollision() {
  var enemy = d3.select(this);
  var alreadyHitByThisShuriken = false;

  var startX = Number(enemy.attr('cx'));
  var startY = Number(enemy.attr('cy'));
  var endX = Math.random() * (canvasWidth - (radius * 2)) + radius;
  var endY = Math.random() * (canvasHeight - (radius * 2)) + radius;

  return function(t) {
    var isHit = collisionDetection(enemy, collisionEffects);
    if (isHit && alreadyHitByThisShuriken === false) {
        collisionEffects();
        alreadyHitByThisShuriken = true;
    }
    enemy.attr('cx', (endX - startX) * Math.pow(t,2) + startX);
    enemy.attr('cy', (endY - startY) * Math.pow(t,2) + startY);
  }
}

function collisionEffects() {
  explode();

  if (audioEnabled === true) {
    var audio = new Audio('explosion.mp3');
    audio.play();
  }

  player.moveToFront();
  updateScoreboard();
}

function updateScoreboard() {
  collisions++;
  d3.select('.collisions').select('span').text(collisions);
  if(currentScore > highScore){
    highScore = currentScore;
    d3.select('.highscore').select('span').text(currentScore);
  }
  currentScore = 0;  
}

function explode() {
  var playerX = player.attr('cx');
  var playerY = player.attr('cy');
  explosionWidth = radius * 10;
  explosionHeight = radius * 10;

  canvas.append('image').attr('x', Number(playerX) - explosionWidth / 2)
                        .attr('y', Number(playerY) - explosionHeight / 2)
                        .attr('xlink:href', 'explosion.gif')
                        .attr('width', explosionWidth)
                        .attr('height', explosionHeight)
                        .transition().duration(1000)
                        .style({'opacity': 0, 'position':'relative','z-index':-1});
}


function moveEnemies () {
  canvas.selectAll('.enemies')
                  .transition().duration(transitionTime)
                  .tween('custom',checkCollision);
                
}

function dragMove (d) {
  d3.select(this)
    .attr("cx", Math.max(radius, Math.min(canvasWidth - radius, d3.event.x)))
    .attr("cy", Math.max(radius, Math.min(canvasHeight - radius, d3.event.y)))
}



function makePlayer() {
  return canvas.selectAll('circles').data([1]).enter().append('circle')
                   .attr('cx',canvasWidth / 2)
                   .attr('cy',canvasHeight / 2)
                   .attr('r',radius)
                   .attr('fill','red')
                   .attr('class','player')
                   .attr('fill', 'url(#img2)')
                   .call(drag);
}

makePattern('shuriken.png','img1');
makePattern('ufo.png','img2');
runClock();
createEnemies(numberOfEnemies);
setInterval(moveEnemies, collisionTime);
var drag = d3.behavior.drag().on("drag", dragMove);
var player = makePlayer();
var movementSpeed = 10;

d3.select("body").on("keydown", function() { 
  var keyCode = d3.event.keyCode;
  var playerX = Number(player.attr('cx'));
  var playerY = Number(player.attr('cy'));
  if (keyCode === 37) {
    player.attr('cx', Math.max(radius, playerX - movementSpeed));
    //go left
  } else if (keyCode === 38) {
    player.attr('cy', Math.max(radius, playerY - movementSpeed));
    //go up
  } else if (keyCode === 39) {
    player.attr('cx', Math.min(canvasWidth - radius, playerX + movementSpeed));
    //go right
  } else if (keyCode == 40) {
    player.attr('cy', Math.min(canvasHeight - radius, playerY + movementSpeed));
    //go down
  }
});
