// start slingin' some d3 here.

var Enemy = function(x,y){
  this.x = x;
  this.y = y;
}
var highScore = 0;
var currentScore = 0;
var collisions = 0;

var enemies = [];
var canvasWidth = 1000; 
var canvasHeight = 1000;
var radius = 10;
var transitionTime = 1000;
var collisionTime = 2000;

var runClock = function(){
  setInterval(function(){
    d3.select('.current').select('span').text(currentScore++);
  }, 100);
}

runClock();

for(var i = 0; i < 150; i++){
  var x = Math.random() * (canvasWidth - (radius * 2)) + radius;
  var y = Math.random() * (canvasHeight - (radius * 2)) + radius;
  enemies.push(new Enemy(x,y));
}

var canvas = d3.select('.board').selectAll('svg')
                  .data([1])
                  .enter()
                  .append('svg');
                  canvas
                  .attr('viewBox', '0 0' + ' ' + canvasWidth + ' ' + canvasHeight);

canvas.append('defs').append('pattern')
                      .attr('id','img1')
                      .attr('patternUnits','objectBoundingBox')
                      .attr('x',0)
                      .attr('y',0)
                      .attr('width',radius*2)
                      .attr('height',radius*2)
                      .append('image')
                      .attr('xlink:href','shuriken.png')
                      .attr('x','0')
                      .attr('y','0')
                      .attr('width',radius*2)
                      .attr('height',radius*2)
                    

var createEnemies = function() {
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

createEnemies();

function collisionDetection(enemy, callback) {
  var playerX = player.attr('cx');
  var playerY = player.attr('cy');
  var enemyX = enemy.attr('cx');
  var enemyY = enemy.attr('cy');
  var r = player.attr('r');
  var hypot = Math.sqrt(Math.pow((playerX-enemyX), 2) + Math.pow((playerY-enemyY), 2));
  if(hypot < r * 2){
    callback();
  }  

  // //east
  // if((playerX + r) > (enemyX - r) && enemyX > playerX){
  //   //south
  //   if((playerY + r) > (enemyY - r) && enemyY > playerY){
  //     callback();
  //     //north
  //   } else if ((playerY - r) < (enemyY + r) && (enemyY < playerY)){
  //     callback();
  //   }
  // //west
  // } else if((playerX - r) < (enemyX + r) && enemyX < playerX) {
  //   if((playerY + r) > (enemyY - r) && enemyY > playerY){
  //     callback();
  //     //north
  //   } else if ((playerY - r) < (enemyY + r) && (enemyY < playerY)) {
  //     callback();
  //   }
  // }
}
var triggered = false;
function checkCollision() {
  var enemy = d3.select(this);
  var hit = false;
  var startX = Number(enemy.attr('cx'));
  var startY = Number(enemy.attr('cy'));

  var endX = Math.random() * (canvasWidth - (radius * 2)) + radius;
  var endY = Math.random() * (canvasHeight - (radius * 2)) + radius;

  return function(t) {
    collisionDetection(enemy, function(){
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
                            // .remove();



      if(hit === false){
        collisions++;
        d3.select('.collisions').select('span').text(collisions);
        if(currentScore > highScore){
          highScore = currentScore;
          d3.select('.highscore').select('span').text(currentScore);
        }
        currentScore = 0;
        hit = true;
      }
    });
    if (triggered === false) {
      console.log(enemy);
      triggered = true;
    }
    // debugger;
    enemy.attr('cx', (endX - startX) * Math.pow(t,2) + startX);
    enemy.attr('cy', (endY - startY) * Math.pow(t,2) + startY);
  }
}

function moveEnemies () {
  canvas.selectAll('.enemies')
                  //.data(enemies)
                  .transition().duration(transitionTime)
                  .tween('custom',checkCollision);
                
}
function dragMove (d) {
  //var position = d3.mouse(canvas[0]);
  d3.select(this)
    .attr("cx", Math.max(radius, Math.min(canvasWidth - radius, d3.event.x)))
    .attr("cy", Math.max(radius, Math.min(canvasHeight - radius, d3.event.y)))
}

var drag = d3.behavior.drag().on("drag", dragMove);

var player = canvas.selectAll('circles').data([1]).enter().append('circle')
                   .attr('cx',canvasWidth / 2)
                   .attr('cy',canvasHeight / 2)
                   .attr('r',radius)
                   .attr('fill','red')
                   .attr('class','player')
                   .call(drag);

setInterval(moveEnemies, collisionTime);


