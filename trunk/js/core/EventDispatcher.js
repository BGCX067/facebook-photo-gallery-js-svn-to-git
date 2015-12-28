/**
 * event dispatcher class
 */

function EventDispatcher() {
    var eventHandlers = [];

    this.init = function() {
        //an empty constructor
    }

    this.addEventListener = function(eventType, listener) {
        if (this.getEventHandlers(eventType, listener).length == 0) {
            eventHandlers.push(new EventDispatcher.EventHandler(eventType, listener));
        }
        return this;
    }

    this.removeEventListener = function(eventType, listener) {
        for (var i=0; i<eventHandlers.length; i++) {
            if (
                eventHandlers[i]
                    &&
                    eventHandlers[i].getEventType() == eventType
                    &&
                    eventHandlers[i].getListener() == listener
                ) {
                eventHandlers[i] = null;
                delete eventHandlers[i];
            }
        }
        return this;
    }

    this.fireEvent = function(event) {
        var handlers = this.getEventHandlers(event.getType());

        for (var i=0; i<handlers.length; i++) {
            if (handlers[i] && handlers[i].getListener()) {
                var listener = handlers[i].getListener();
                listener(event);
            }
        }
        return this;
    }

    this.getEventHandlers = function(eventType, listener) {
        if (!eventType && !listener) {
            return eventHandlers;
        }

        var handlers = [];

        for (var i=0; i<eventHandlers.length; i++) {
            if (eventHandlers[i] && eventHandlers[i].getEventType() == eventType && (listener == null || eventHandlers[i].getListener() == listener)) {
                handlers.push(eventHandlers[i])
            }
        }
        return handlers;
    }

    this.init();
}

EventDispatcher.EventHandler = function (_eventType, _listener) {
    var eventType = _eventType;
    var listener = _listener;

    this.getEventType = function() {
        return eventType;
    }

    this.getListener = function() {
        return listener;
    }
}

EventDispatcher.Event = function (_type, _data) {
    var type = _type;
    var data = _data;

    this.getType = function() {
        return type;
    }

    this.getData = function() {
        return data;
    }
}

// Enable debugging of dynamically loaded scripts
//@ sourceURL=/js/core/EventDispatcher.js