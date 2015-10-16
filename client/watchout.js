// start slingin' some d3 here.

var Enemy = function(x,y){
  this.x = x;
  this.y = y;
}

var enemies = [];
var canvasWidth = 1000; 
var canvasHeight = 1000;
var radius = 10;
var transitionTime = 850;
var collisionTime = 1000;

for(var i = 0; i < 100; i++){
  var x = Math.random() * (canvasWidth - (radius * 2)) + radius;
  var y = Math.random() * (canvasHeight - (radius * 2)) + radius;
  enemies.push(new Enemy(x,y));
}

var canvas = d3.select('.board').selectAll('svg')
                  .data([1])
                  .enter()
                  .append('svg')
                  .attr('viewBox', '0 0' + ' ' + canvasWidth + ' ' + canvasHeight);

var createEnemies = function() {
  canvas.selectAll('circle')
                 .data(enemies)
                 .enter()
                 .append('circle')
                 .attr('cx', function(d){return d.x;})
                 .attr('cy', function(d){return d.y;})
                 .attr('r', radius);
}

createEnemies();

var moveEnemies = function(){
  canvas.selectAll('circle')
                  //.data(enemies)
                  .transition().duration(transitionTime)
                  .attr('cx', function(){return Math.random() * (canvasWidth - (radius * 2)) + radius;})
                  .attr('cy', function(){return Math.random() * (canvasHeight - (radius * 2)) + radius;});
                
}

setInterval(moveEnemies, collisionTime);


