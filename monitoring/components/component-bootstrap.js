var componentBlock = document.createElement("components");

document.body.appendChild(componentBlock);

var componentList = ['example', 'status-button', 'status-checker', 'component', 'jumbotron', 'monitor-status', 'navigation', 'product-monitor'];

$(function() {
  for(index in componentList) {
    var name = componentList[index];
    $(componentBlock).load("/monitoring/components/" + name + ".component.html");
  }
});
