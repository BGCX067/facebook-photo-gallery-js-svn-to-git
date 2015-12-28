$import("core.Cookie");

/* --------------------------------------------------
    Styles related
-------------------------------------------------- */

var Style = {
    
    CLASS_HIDDEN: "hidden",
    
    toPx: function (value) {
        return Math.round(value) + "px";
    },
    
    hasClass: function (object, className) {
        var object = $element(object);
        if(object && object.className) {
            return (object.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)')) != null);
        }
        
        return false;
    },
    
    addClass: function (object, className) {
        var object = $element(object);
        if(object) {
            if (!Style.hasClass(object, className)) object.className += " " + className;
        }
    },
    
    removeClass: function (object, className) {
        var object = $element(object);
        
        if(object) {
            if (Style.hasClass(object, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                object.className = object.className.replace(reg,' ');
                /*object.className = object.className.replace(className, "");*/
                object.className = object.className.trim();
            };
        }
    },

    updateClass: function (object, className, add) {
        if (add) {
            this.addClass(object, className);
        } else {
            this.removeClass(object, className);
        }
    },

    hide: function (object) {
        if(object) {
            Style.addClass(object, Style.CLASS_HIDDEN);
        }
    },
    
    show: function (object) {
        if(object) {
            Style.removeClass(object, Style.CLASS_HIDDEN);
        }       
    },
    
    isHidden: function (object) {
        return Style.hasClass(object, Style.CLASS_HIDDEN);
    },  
    
    States: {}, 
    STATE_GLOBAL: "",
    STATE_RUNTIME: "STATE_RUNTIME",
    STATE_CURRENT_PAGES: escape(window.location.pathname),
    STATE_CURRENT_PAGE: (escape(window.location.pathname) + escape(window.location.search)),
    
    getStateName: function(context) {
        var stateName = "States";       
        stateName += (context) ? ((typeof(context) == "string" && context.trim().length > 0) ? ("[" + context + "]") : "") : ("[" + escape(window.location.pathname + window.location.search) + "]");
        return stateName;
    },
    
    isLocalState: function(stateName) {
        stateName = (!stateName) ? Style.STATE_RUNTIME : stateName;
        return (stateName == Style.STATE_GLOBAL || stateName == Style.STATE_RUNTIME || stateName == Style.STATE_CURRENT_PAGE || stateName == Style.STATE_CURRENT_PAGES);
    },
    
    saveState: function (object, stateName) {
        if (object.tagName) {
            stateName = (!stateName) ? Style.STATE_RUNTIME : Style.getStateName(stateName);
            
            var states = Style.isLocalState(stateName) ? Style.States : Style.openStates(stateName);
            
            states[object.id] = new Object();
            
            if (object.className && object.className.trim().length > 0) {       
                states[object.id].c = object.className;
            }
                    
            for(var i in object.style) {
                if (object.style[i] != "" && typeof(object.style[i]) == "string" && isNaN(parseInt(i))) {
                    if (!states[object.id].s) {
                        states[object.id].s = new Object();
                    }
                    states[object.id].s[i] = object.style[i];               
                }           
            }
            
            if (object.tagName.toLowerCase() == "input" || object.tagName.toLowerCase() == "button") {
                states[object.id].v = object.value;
                states[object.id].d = object.disabled;
                states[object.id].ch = object.checked;
                states[object.id].se = object.selected;
            } else if (object.tagName.toLowerCase() == "a") {
            }
            
            if (stateName == Style.STATE_RUNTIME) {
                Style.States = states;
            } else {
                Style.saveStates(states, stateName);                
            }
        }
    },
    
    saveStates: function (states, stateName) {
        var date = new Date();
        Cookie.set(stateName, JSON.stringify(states), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 356));
    },
    
    openStates: function (name) {
        var cookie = Cookie.get(name);
        var states = new Object();
        
        if (cookie) {
            cookie = JSON.parse(cookie);
            if (cookie) states = cookie;
        }
        
        return states;
    },  
    
    removeState: function (object, stateName) {
        if (object && object.tagName) {
            stateName = (!stateName) ? Style.STATE_RUNTIME : Style.getStateName(stateName);
            
            var states = Style.isLocalState(stateName) ? Style.States : Style.openStates(stateName);
            
            if (states[object.id]) {
                states[object.id] = null;
                delete states[object.id];
                
                if (stateName != Style.STATE_RUNTIME) {
                    Style.saveStates(states, stateName);
                }
            }
        }
    },
    
    restoreStates: function() {
        var states = Object.copy(Style.openStates(Style.getStateName(Style.STATE_GLOBAL)), new Object());       
        states = Object.copy(Style.openStates(Style.getStateName(Style.STATE_CURRENT_PAGES)), states);
        states = Object.copy(Style.openStates(Style.getStateName(Style.STATE_CURRENT_PAGE)), states);
        states = Object.copy(Style.States, states);
        
        for(var i in states) {
            var object = $element(i);
            if (object && object.tagName) {
                if (states[i].c) {
                    object.className = states[i].c;
                }
                
                if (states[i].s) {
                    for(var j in states[i].s) {
                        //debug(object.id + " " + j + " == " + states[i].style[j]);
                        object.style[j] = states[i].s[j];
                    }
                }
                
                if (object.tagName.toLowerCase() == "input" || object.tagName.toLowerCase() == "button") {
                    object.value = states[i].v;
                    object.disabled = states[i].d;
                    object.checked = states[i].ch;
                    object.selected = states[i].se;
                    /*
                    if (object.innerHTML && object.innerHTML != "") {
                        object.innerHTML = states[i].i;
                    }
                    */
                } else if (object.tagName.toLowerCase() == "a") {
                    /*
                    if (object.innerHTML && object.innerHTML != "") {
                        object.innerHTML = states[i].i;
                    }
                    */
                }   
            }
        }
    },
    
    displayChilds: function (object, display, nodeType) {
        var childs = object.childNodes;
        var length = childs.length;
        
        for (var i = 0; i < length; i++) {
            if(childs[i].style)
            if(!nodeType || (nodeType && childs[i].tagName == nodeType)){
                childs[i].style.display = display;
            }
        }
    },
    
    include: function (url, media) {
        var style = document.createElement("link");
        
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("type", "text/css");
        style.setAttribute("href", url);
        style.setAttribute("media", ((media) ? media : "screen"));
        
        document.getElementsByTagName("head")[0].appendChild(style); 
    }
};

//EventUtils.addListener(window, "load", Style.restoreStates);