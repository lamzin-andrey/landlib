function toast(x, y, text, title, img, className) {
	var a, s = '';
	className = className ? (' ' + className + ' ') : s;
	img = img ? ('<img src="' + img + '">') : s;
	title = title ? ('<div class="ttl">' + title + '</div>') : s;
	s = '<div class="toast' + className + '">';
	s += img + title + text; + '</div><div class="cf"></div>';
	a = appendChild(bod(), 'div', s, {style:'position:fixed;z-index:5000'});
	stl(a, 'left', x + 'px');
	stl(a, 'top', y + 'px');
	delay(function(){
		rm(a);
	}, 5*1000);
	a.onclick = function(){
		rm(a);
	}
}
