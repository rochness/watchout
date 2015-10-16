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
                  .append('svg');
                  canvas
                  .attr('viewBox', '0 0' + ' ' + canvasWidth + ' ' + canvasHeight);

var createEnemies = function() {
  canvas.selectAll('.enemies')
                 .data(enemies)
                 .enter()
                 .append('circle')
                 .attr('cx', function(d){return d.x;})
                 .attr('cy', function(d){return d.y;})
                 .attr('r', radius)
                 .attr('class', 'enemies');
}

createEnemies();

var moveEnemies = function(){
  canvas.selectAll('.enemies')
                  //.data(enemies)
                  .transition().duration(transitionTime)
                  .attr('cx', function(){return Math.random() * (canvasWidth - (radius * 2)) + radius;})
                  .attr('cy', function(){return Math.random() * (canvasHeight - (radius * 2)) + radius;});
                
}
var dragMove = function(d) {
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


