var Cookie = {};

Cookie.getCookieVal = function (offset) {
	var endstr = document.cookie.indexOf(";", offset);
	if (endstr == -1) endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}

Cookie.get = function (name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;

	while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring( i , j ) == arg) return Cookie.getCookieVal(j);
		i++;
	}
	
	return null;
}

Cookie.getOrDefault = function (name, _default) {
	var value = Cookie.get(name);
	return (value != null) ? value : _default;
}

Cookie.set = function (name,value,expires,path,domain,secure) {
	var str = name + "=" + escape(value) + ((expires) ? "; expires=" + expires.toGMTString() : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
	//alert(str);
	document.cookie = str;
}

Cookie.remove = function (name,path,domain) {
	if(Cookie.get(name)) {
		document.cookie = name + "=" + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + "expires=Thu, 01-Jan-70 00:00:01 GMT";
	}
}