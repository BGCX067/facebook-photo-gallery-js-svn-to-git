var BASE_PATH = "/js";

var __packages = new Array();

//IE9 9and other (consoleless browsers) workarond
try {
    if (!console) {
        simulateConsole();
    }
} catch(e) {
    simulateConsole();
}

function simulateConsole() {
    console = new Object();
    console.info = console.log = console.warn = console.error = function(message) {
        //alert(message);
    }   
}

function $import(path, required) {

    if (required == null) {
        required = true;
    }

    try {
        //throw null;
        
        if (!__packages[path]) {
            __packages[path] = true;
            var url = BASE_PATH;        
            var _path = path.split(".");        
            for (var i=0; i<_path.length; i++) {
                url += "/" + _path[i];
            }       
            url += ".js";
            
            var scripts = document.getElementsByTagName("script");
            for (var i=0; i<scripts.length; i++) {
                if (scripts[i].src.indexOf(url) > -1) {
                    return false;
                }
            }            
            
            var request = new XMLHttpRequest();
            request.open("GET", url, !required);
            try {
                request.overrideMimeType("text/plain");
            } catch(e) {
                
            }
            
            //console.info("Importing JavaScript file " + url);
            
            request.send();
            if (request.readyState == 4 && (request.status == 0 || request.status == 200)) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.language = "javascript";
                script.text = request.responseText;
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        }
    } catch(e) {
        __packages[path] = false;
        console.warn("Unable to import JavaScript file " + path + ". Error: " + e);     
        $include(path);
    }
}

function $include(path, defer) {
    if (__packages[path]) {
        return;
    }
    
    __packages[path] = true;
    
    var scripts = document.getElementsByTagName("script");
    var url = BASE_PATH;
    
    path = path.split(".");
    
    for (var i=0; i<path.length; i++) {
        url += "/" + path[i];
    }
    
    url += ".js";
    
    for (var i=0; i<scripts.length; i++) {
        if (scripts[i].src.indexOf(url) > -1) {
            return false;
        }
    }
    
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.language = "javascript";
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

$import("core.sizzle.sizzle");
$import("core.extensions");

function $$(selector, context) {
    return Sizzle(selector, context);
}

function $element(element) {
    if (typeof(element) == "string") {
        if (element.indexOf("#") == 0) {
            element = element.replace("#", "");
            element = document.getElementById(element);
        } else {
            element = $$(element);

            if (element && element.length > 0) {
                element = element[0];
            } else {
                element = null;
            }
        }
    }

    return element;
}