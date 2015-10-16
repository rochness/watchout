// start slingin' some d3 here.

var Enemy = function(x,y){
  this.x = x;
  this.y = y;
}

var enemies = [];
var canvasWidth = 1000; 
var canvasHeight = 1000;
var radius = 10;

for(var i = 0; i < 100; i++){
  var x = Math.random() * (canvasWidth - (radius * 2)) + radius;
  var y = Math.random() * (canvasWidth - (radius * 2)) + radius;
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


