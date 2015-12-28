var Mouse = new EventDispatcher();

Mouse.y = 0;
Mouse.x = 0;
Mouse.onMove = null;

Mouse.vDirection = "";
Mouse.hDirection = "";

Mouse.onMove = function(_event){
    _event = EventUtils.getEvent(_event);
    
    var x = 0;
    var y = 0;
    
    if(_event.pageX){
        x = _event.pageX;
        y = _event.pageY;
    }else{
        x = _event.clientX + document.documentElement.scrollLeft;
        y = _event.clientY + document.documentElement.scrollTop;
    }
    
    Mouse.hDirection = (x > Mouse.x) ? "right" : "left";
    Mouse.vDirection = (y > Mouse.y) ? "bottom" : "top";
    Mouse.hDirection = (x == Mouse.x) ? "center" : Mouse.hDirection;
    Mouse.vDirection = (y == Mouse.y) ? "middle" : Mouse.vDirection;
    
    Mouse.x = x;
    Mouse.y = y;
    
    var event = new Object();
    event.type = "mousemove";
    event.x = x;
    event.y = y;
    Mouse.fireEvent(event);
}

Mouse.isOver = function(object){
    var x = window.getX(object);
    var y = window.getY(object);
    
    if((Mouse.x > x && Mouse.x < (x + object.offsetWidth))&&
       (Mouse.y > y && Mouse.y < (y + object.offsetHeight))){
        return true;
    }
    
    return false;
}

Mouse.getActiveChild = function (object) {
    if (Mouse.isOver(object)) {
        var childs = object.childNodes;
        var length = childs.length;
        
        for (var i = (length-1); i >= 0 ; i--) {            
            if (Mouse.isOver(childs[i])) {
                return Mouse.getActiveChild(childs[i]);
            }
        }           
        return object;
    } else {
        return false;
    }
}   

EventUtils.addListener(document, "mousemove", Mouse.onMove);