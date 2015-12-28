$import("core.EventDispatcher");
$import("core.JSON");

HTTPRequest.extend(EventDispatcher);
HTTPRequest.requests =  new Array();
HTTPRequest.METHOD_POST = "POST";
HTTPRequest.METHOD_PUT = "PUT";
HTTPRequest.METHOD_DELETE = "DELETE";
HTTPRequest.METHOD_HEAD = "HEAD";
HTTPRequest.METHOD_GET = "GET";

HTTPRequest.EVENT_TYPE_STATE_CHANGE = "onStateChange";

function HTTPRequest(){    
    var request = null;
    var id = HTTPRequest.requests.length;
    var url = "";
    var method = HTTPRequest.METHOD_GET;
    var debugEnabled = false;
    var state = null;
    var async = true;
    var onLoadHandler = null;
    var onErrorHandler = null;
    
    var params = new Object();
    var payload = null;
    var headers = new Object();
    //headers["Content-Type"] = "text/xml; charset=UTF-8";
    headers["Cache-Control"] = "no-cache";
    
    HTTPRequest.requests.push(this);
    
    this.getId = function() {
        return id;
    }
    
    this.getState = function() {
        return state;
    }

    this.setUrl = function(_url) {
        url = _url;
        return this;
    }

    this.getUrl = function() {
        return url;
    }
    
    this.setMethod = function(_method) {
        method = _method;
        
        switch(method) {
            case HTTPRequest.METHOD_POST:
            case HTTPRequest.METHOD_PUT:
                //headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
                break;
            default:
                //headers["Content-Type"] = "text/xml; charset=UTF-8";
                break;
        }
        
        return this;
    }

    this.getMethod = function() {
        return method;
    }
    
    this.setAsync = function(_async) {
        async = _async;
        return this;
    }

    this.getAsync = function() {
        return async;
    }
    
    this.getHeaders = function() {
        return headers;
    }
    
    this.setHeader = function(name, value) {
        headers[name] = value;
        return this;
    }

    this.getParams = function() {
        return params;
    }

    this.setParam = function(name, value) {
        params[name] = value;
        return this;
    }
    
    this.setParams = function(_params) {
        params = _params;
        return this;
    }    
    
    this.getPayload = function() {
        return payload;
    }

    this.setPayload = function(_payload) {
        payload = _payload;
        return this;
    }    
    
    this.setDebugEnabled = function(_debugEnabled) {
        debugEnabled = _debugEnabled;
        return this;
    }
    
    this.setOnLoadHandler = function(_onLoadHandler) {
        onLoadHandler = _onLoadHandler;
        return this;
    }

    this.setOnErrorHandler = function(_onErrorHandler) {
        onErrorHandler = _onErrorHandler;
        return this;
    }
        
    var create = function(){
        var object = null;

        if (window.XMLHttpRequest) {
            object = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            object = new ActiveXObject("MSXML2.XMLHTTP");
        }
        
        return object;
    };    
    
    this.submit = function() {
        request = create();
        
        var _this = this;
        var _id = this.getId().toString(); 
        
        request.onreadystatechange = function() {
            _this.onStateChange(_id);
        }

        if (window.location.href.indexOf("https://") == 0) {
           url = url.replace("http://", "https://");
        }
        
        Object.iterate(params, function(paramName, paramValue) {
                if (
                        (typeof(paramValue) == "string" || typeof(paramValue) == "number" || typeof(paramValue) == "boolean")
                        &&
                        (typeof(paramName) == "string" || typeof(paramName) == "number" || typeof(paramName) == "boolean")
                    ) {
                    if (url.indexOf("?") == -1) {
                        url += "?";
                    } else {
                        url += "&";
                    }
                    url += paramName + "=" + paramValue;
                }
            });
        
        request.open(method, url, async);
        
        Object.iterate(headers, function(headerName, headerValue) {
            request.setRequestHeader(headerName, headerValue);
        });
        
        request.send(payload);
        
        return this;
    };
    
    this.abort = function() {
        request.abort();
        return this;
    };
    
    this.getRequest = function() {
        return request;
    };
    
    this.onStateChange = function (_id) {
        if (request.readyState == 4) {
            state = new HTTPRequest.State(request.readyState, request.status, request.statusText, request.responseText, request.responseXML, HTTPRequest.requests[_id]);
        } else {
            state = new HTTPRequest.State(request.readyState, null, null, null, null, HTTPRequest.requests[_id]);
        }
        
        if (state.getCode() == 4) {            
            if (state.getStatus() >= 200 && state.getStatus() < 300) {               
                if (onLoadHandler) {
                    onLoadHandler(state);
                }
            } else {
                if (onErrorHandler) {
                    onErrorHandler(state);
                }
            }
        }
        
        this.fireEvent(new EventDispatcher.Event(HTTPRequest.EVENT_TYPE_STATE_CHANGE, state));
    };
}

HTTPRequest.fromURLToPOST = function(url) {
    return url.slice(url.indexOf("?")+1);
}

HTTPRequest.State = function(_code, _status, _statusTest, _text, _nodes, _request) {
    var status = _status;
    var code = _code;
    var statusTest = _statusTest;
    var text = _text;
    var nodes = _nodes;
    var request = _request;
    
    this.getStatus = function() {
        return status;
    }
    this.getCode = function() {
        return code;
    }
    this.getStatusText = function() {
        return statusTest;
    }    
    this.getText = function() {
        return text;
    }
    this.getJSON = function(type) {
        //console.log(text);
        
        var object = JSON.parse(text);
        
        if (type) {
            object = Object.cast(type, object);
        }
        
        return object;
    }    
    this.getNodes = function() {
        return nodes;
    }
    this.getRequest = function() {
        return request;
    }    
}