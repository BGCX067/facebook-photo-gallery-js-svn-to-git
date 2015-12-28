/**
 * 
 */

var EventUtils = {};

EventUtils.addListener = function(element, event, listener, capture) {
    try {
        if (element.addEventListener) {
            capture = (!capture) ? false : true;
            element.addEventListener(event, listener, capture);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, listener);
        } else {
            element["on" + event] = listener;
        }
    } catch(e) {
        console.warn("EventUtils: Unable to addListener:", e , element, event, listener);
    }
};

EventUtils.removeListener = function(element, event, listener, capture) {
    try {
        if (element.removeEventListener) {
            capture = (!capture) ? false : true;
            element.removeEventListener(event, listener, capture);
        } else if (element.detachEvent) {
            element.detachEvent("on" + event, listener);
        } else {
            element["on" + event] = null;
        }
    } catch(e) {
        console.warn("EventUtils: Unable to removeListener:", e , element, event, listener);
    } 
};

EventUtils.getEvent = function(e) {
    return (e) ? e : window.event;
};

EventUtils.getTarget = function(e) {
    return (e.srcElement) ? e.srcElement : e.target;
};

EventUtils.block = function(e) {
    e = EventUtils.getEvent(e);
    e.cancelBubble = true;
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    e.returnValue = false;

    if (e.preventDefault) {
        e.preventDefault();
    }
};

// Removes specified event from the list of DOM elements, returns [element:eventHandler] map
EventUtils.groupRemoveDomEvent = function(elements, eventName) {
    var eventsMap = {};
    Object.iterate(elements, function(i){
        var obj = elements[i];
        eventsMap[obj] = obj[eventName];
        obj[eventName] = null;
    });
    return eventsMap;
},

// Restores specified event for the list of DOM elements, expects [element:eventHandler] map as eventsMap
EventUtils.groupRestoreDomEvent = function(elements, eventName, eventsMap) {
    Object.iterate(elements, function(i){
        var obj = elements[i];
        obj[eventName] = eventsMap[obj];        
    });
}

EventUtils.stopEvent = function(e) {
    e = EventUtils.getEvent(e);
    e.cancelBubble = true;
    if (e.stopPropagation) {
        e.stopPropagation();
    }   
};