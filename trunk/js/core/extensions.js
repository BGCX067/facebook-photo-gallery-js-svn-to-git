$import("core.EventDispatcher");

/* --------------------------------------------------
	JS extensions
-------------------------------------------------- */


/* Object related */

/**
 * A simple JS inheritance
 * IMPORTANT!!!! READ THE RULES:
 * 1) each ancestor class should explicitly invoke this.init() with any required arguments. It will lead to (automatic) call of the super class init()
 */
Function.prototype.extend = function(parent)
{
    $extend(this, parent);
};

function $extend(child, parent) {
    child.prototype = new parent();

    var _old = child.prototype.init;

    child.prototype.init = function() {
        $extend(child, parent);
        if (_old) {
            _old.apply(this, arguments);
        };
    };

    child.prototype.constructor = child;
    child.superclass = parent;
	
	//inherit static properties
	/*
	for (var i in parent) {
	    if (parent.__proto__ && !parent.__proto__[i]) {
	        this[i] = parent[i];
	    }
	}
	*/	
};



Function.prototype.getClassName = function() {
	return Object.getClassName(this.prototype);
};

Function.getSetterByGetter = function(getter) {
    var setter = null;
    if (getter.indexOf("get") == 0) {        
        setter = getter.replace("get", "set");
    }
    return setter;
}

Function.getSetterByProperty = function(property) {
    return "set" + property.substr(0,1).toUpperCase() + property.substr(1);
}

Function.getGetterByProperty = function(property) {
    return "get" + property.substr(0,1).toUpperCase() + property.substr(1);
}

Function.getPropertyByGetter = function(getter) {
    var property = null;
    if (getter.indexOf("get") == 0) {        
        property = getter.replace("get", "");
        property = property.substr(0,1).toLowerCase() + property.substr(1);
    }
    return property;
}

Function.wrapIfNull = function(f) {
    if (!Function.isFunction(f) || f == null) {
        f = new Function();
    }
    return f;
}

/* Function related */

Function.parse = function(expression) {
    if (typeof(expression) == "string") {
        expression = new Function(expression);
    }
    return expression;
};

Function.isFunction = function(object) {
    return typeof(object) == "function";
}

/*
Object.prototype.getClassName = function() {
	return Object.getClassName(this);
};

Object.prototype.getSuperClass = function () {
	return this.superclass;
};
*/

Object.getClassName = function(func) {
	func = func.constructor;
  if ( typeof(func) == "function" || typeof(func) == "object" )
  var fName = (""+func).match(
    /function\s*([\w\$]*)\s*\(/
  ); if ( fName !== null ) return fName[1];
};

Object.getInstanceOf = function(type) {
	return new type();
};

/*
Object.prototype.iterate = Array.prototype.iterate = function(iterator) {
    Object.iterate(this, iterator);
}
*/

Object.iterate = function(object, iterator) {
    if ((object instanceof Array) || (object instanceof HTMLCollection)) {
        for (var i=0; i<object.length; i++) {
            if (typeof(object[i]) != "function") {
                if (iterator(i, object[i]) === false) {
                    break;
                };
            }
        }
    } else {
        for (var i in object) {
            if (typeof(object[i]) != "function") {
                if (iterator(i, object[i]) === false) {
                    break;
                };
            }
        }
    }
}

Object.copy = function(from, to) {

    //console.log("Object.copy start:", from, to);

    var fromClassName = Object.getClassName(from);
    var toClassName = Object.getClassName(to);
    var honorFromProperties = (fromClassName == "Object" || fromClassName == "Array") ? false : true;
    var honorToProperties = (toClassName == "Object" || toClassName == "Array") ? false : true;

    //console.log(honorFromProperties, honorToProperties);

    if (!honorToProperties && !honorFromProperties) {
        Object.iterate(from, function(name, value) {
            to[name] = value;
        });
    } else {
        for (var i in from) {
            if (typeof(from[i]) != "function") {
                if (honorToProperties) {
                    if (to.hasOwnProperty(i)) {
                        to[i] = from[i];
                        //console.log("setting property1: ", i, from[i]);
                    } else if (to.hasOwnProperty(Function.getSetterByProperty(i))) {
                        to[Function.getSetterByProperty(i)].call(to, from[i]);
                        //console.log("calling setter1: ", i, Function.getSetterByProperty(i), from[i]);
                    }
                } else {
                    to[i] = from[i];
                    //console.log("setting property2: ", i, from[i]);
                }
            } else {
                if (honorToProperties) {
                    if (to.hasOwnProperty(Function.getSetterByGetter(i))) {
                        to[Function.getSetterByGetter(i)].call(to, from[i].call(from))
                        //console.log("calling setter2: ", i, Function.getSetterByGetter(i), from[i].call(from));
                    }
                } else {
                    var propertyName = Function.getPropertyByGetter(i);
                    if (propertyName && from.hasOwnProperty(Function.getSetterByGetter(i))) {
                        to[propertyName] = from[i].call(i);
                        //console.log("setting property3: ", propertyName, from[i].call(i));
                    }
                }
            }
        }
    }

    //console.log("Object.copy end:", to);

    return to;
};

Object.cast = function(type, object) {
    var result = object;
    if (object != null && Object.getClassName(object) != Object.getClassName(type)) {
        result = Object.copy(object, Object.getInstanceOf(type));
    }
	return result;
};

Object.isObject = function (object) {
	return typeof(object) == "object";
};

Number.isNumeric = function (number) {
	return !isNaN(parseInt(number));
};

/* Array related */


Array.isArray = function (array) {
	return Object.getClassName(array.constructor).toLowerCase() == "array";
};

Array.indexOf = function (array, value) {
	for(var i=0; i< array.length; i++) {
		if(value == array[i]) {
			return i;
		}
	};
	
	return -1;
};

Array.remove = function (array, element) {
    var tempArray = new Array();
    for (var p=0; p<array.length; p++) {
        if (array[p] != element) {
            tempArray[tempArray.length] = array[p];
        }
    }

    return tempArray;
};

Array.copy = function(to, from) {
	for (var i=0; i<from.length; i++) {
		to[i] = from[i];
	}
	return to;
};

Array.iterate = function(object, iterator) {
    Object.iterate(object, iterator);
};

/* String related */

String.prototype.addslashes = function(){
	return this.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g, '\\$1');
};

String.prototype.trim = function () {
    return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
};

/*
String.prototype.trim = function (chars) {
    return this.ltrim(this.rtrim(chars), chars);
};
*/
             
String.prototype.ltrim = function (chars) {
    chars = chars || "\\s";
    return this.replace(new RegExp("^[" + chars + "]+", "g"), "");
};
        
String.prototype.rtrim = function (chars) {
    chars = chars || "\\s";
    return this.replace(new RegExp("[" + chars + "]+$", "g"), "");
};

RegExp.escapeRegexpSpecialChars = function(s) {
    return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};

/*
String.prototype.trim = function () {
    return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
};
*/

Boolean.toBoolean = function(value) {
	value = (value === "true") ? true : value;
	value = (value === "false") ? false : value;
	value = (value == 1) ? true : value;
	value = (value == 0) ? false : value;
	return value;
};


/* Date related */

Date.getTimestamp = function() {
	return (new Date()).getTime();
};

/* Window related */
	
window.getX = function (object, context, _debug) {
	return window.getPosition(object, context, _debug).x;
};

window.getY = function (object, context, _debug) {
	return window.getPosition(object, context, _debug).y;
};

window.getPosition = function (obj, context, _debug) {
	var curleft = curtop = 0;
	
	if (obj && obj.offsetParent) {
		if (_debug)	console.log(obj + " " + obj.tagName + " " + obj.className + " : " + obj.offsetTop + " + " + obj.scrollTop + "    " + obj.offsetLeft + " + " + obj.scrollLeft);
		
		if (_debug)	console.log(curtop + "  " + curleft);
		
		curleft = obj.offsetLeft;
		curtop = obj.offsetTop;
		
		/*
		curleft -= obj.scrollLeft;
		curtop -= obj.scrollTop;
		*/
		
		var obj2 = obj;
		
		while (obj2 = obj2.offsetParent) {
			if (obj2.tagName && obj2.tagName.toLowerCase() != "html" && obj2 != document.body) {
				if (_debug)	console.log(obj2 + " " + obj2.tagName + " " + obj.className + " : " + obj2.offsetTop + " + " + obj2.scrollTop + "    " + obj2.offsetLeft + " + " + obj2.scrollLeft);				
				
				curleft -= (obj2.scrollLeft) ? obj2.scrollLeft : 0;
				curtop -= (obj2.scrollTop) ? obj2.scrollTop : 0;
				
				if (_debug)	console.log(curtop + "  " + curleft);
			}
			
			if (context && (obj2 == context || context.offsetParent == obj2.offsetParent)) {
				break;
			}
		}
		
		if (_debug)	console.log("Total: " + curtop + "  " + curleft);
		
		while (obj = obj.offsetParent) {
			if (_debug)	console.log(obj + " " + obj.tagName + " " + obj.className + " : " + obj.offsetTop + " + " + obj.scrollTop + "    " + obj.offsetLeft + " + " + obj.scrollLeft);
						
			curleft += (obj.offsetLeft) ? obj.offsetLeft : 0;
			curtop += (obj.offsetTop) ? obj.offsetTop : 0;
			//curleft += (obj.currentStyle && !isNaN(parseInt(obj.currentStyle.borderLeftWidth))) ? parseInt(obj.currentStyle.borderLeftWidth) : 0;
			//curtop += (obj.currentStyle && !isNaN(parseInt(obj.currentStyle.borderTopWidth))) ? parseInt(obj.currentStyle.borderTopWidth) : 0;
			curleft += (obj.clientLeft) ? obj.clientLeft : 0;
			curtop += (obj.clientTop) ? obj.clientTop : 0;
			
			if (_debug)	console.log(curtop + "  " + curleft);
			
			if (context && (obj == context || context.offsetParent == obj.offsetParent)) {
				break;
			}
		}
	}
	
	return {x: curleft, y: curtop};
};	

window.printPage = function () {
	var result = false;
	if (window.print) {
		window.print();
		result = true;
	} else {
		alert("Sorry, your browser doesn't support this feature.");
	}
	return result;
};
	
window.baseTitle = document.title,
	
window.updateTitle = function (title) {
	document.title = window.baseTitle + " / " + title;
};

/* Document related */

document.getParentByClassName = function (object, className) {
	while (object = object.parentNode) {
		if (Style.hasClass(object, className)) {
			return object;
		}
	}	
	return null;
};
	
document.getParentByTagName = function (object, tagName) {
	while (object = object.parentNode) {
		if (object.tagName && object.tagName.toLowerCase() == tagName.toLowerCase()) {
			return object;
		}
	}
	return null;
};

document.isParent = function (parent, context) {
	while (context = context.parentNode) {
		if (context == parent) {
			return true;
		}
	}
	return false;
};

document.isChild = function (object, child){
	var isChild = false;
	
	if(object){
		var childs = object.childNodes;
		var length = childs.length;
		
		for (var i = 0; i < length; i++) {
			if (childs[i] == child) {
				isChild = true;
				break;
			} else if(document.isChild(childs[i], child)) {
				isChild = true;
				break;
			}
		}
	}
	
	return isChild;	
};
	
document.getChildsByName = function (object, name){
	var childs = new Array();
	
	if(object && object.name){
		if(object.name == name){
			childs.push(object);
		}
	}else{
		if(object.getAttribute)
		if(object.getAttribute("name") == name)
			childs.push(object);
	}
	
	if(object){
		var _childs = object.childNodes;
		var length = _childs.length;
		
		for (var i = 0; i < length; i++) {
			var array = new Array();
			array = document.getChildsByName(_childs[i], name);
			for (var j = 0; j < array.length; j++) {
				childs.push(array[j]);
			}
		}
	}
	
	return childs;	
};
	
document.populateNode = function (node) {
	var clone = node.cloneNode(true);
	(node.nextSibling) ? node.parentNode.insertBefore(clone, node.nextSibling) : node.parentNode.appendChild(clone);
	return clone;
};
	
document.removeNode = function (node) {
	return node.parentNode.removeChild(node);
};

	/* --------------------------------------------------
		DOM attributes
	-------------------------------------------------- */
	
document.set = function (object, attribute, value){
	try{
		if(object[attribute] != value){
			object[attribute] = value;
			document.fireEvent(object, "on"+attribute, value);
			return true;
		}
	}catch(e){
		//alert("Error ondocument.set("+object+","+attribute+","+value+")");
	}	
	return false;
};
	
document.get = function (node, attributeName, defaultValue){
	var value = node.getAttribute(attributeName);
	
	if(value == undefined || value == null)
		value = defaultValue;
	
	return value;
};
	
document.fireEvent = function (object, _event, data){
	if(object[_event]){
		var handler = Function.parse(object[_event]);
		if (typeof(handler) == "function") {
			handler(object, _event, data);
		}
	}
};