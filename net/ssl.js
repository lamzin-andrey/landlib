/**
 * @depends micron.js
 * @depends httpquerystring.es5.js
 */
 
function SSLAgent() {
	this.watch();
}
SSLAgent.SSL_ALLOW = 1;
SSLAgent.SSL_DISALLOW = 2;
var P = SSLAgent.prototype;

P.watch = function() {
	var url = 'https://' + HttpQueryString.host() + '/i/px.png',
		o = this, saved, img;
	if (!HttpQueryString.isSSL()) {
		saved = parseInt(storage('ssl'));
		if (saved == SSLAgent.SSL_DISALLOW) {
			return;
		}
		if (saved == SSLAgent.SSL_ALLOW) {
			location.href = 'https://' + $_SERVER['HTTP_HOST'] + $_SERVER['REQUEST_URI'];
			return;
		}
		
		/*Rest._get(function(data){
			o.onSuccessGetSSlData(data);
		}, url, function(data, responseText, info, xhr){
			o.onFailGetSSlData(data, responseText, info, xhr);
		});*/
		img = appendChild(bod(), 'img', '', {
			'src': url,
			'class': 'imprld',
			'onload': function(evt){
				o.onSuccessGetSSlData(evt);
			},
			'onerror': function(error){
				o.onFailGetSSlData(error);
			}
		});
	}
}
P.onSuccessGetSSlData = function(evt) {
	console.log(evt);
	storage('ssl', SSLAgent.SSL_ALLOW);
	location.href = 'https://' + $_SERVER['HTTP_HOST'] + $_SERVER['REQUEST_URI'];
}

P.onFailGetSSlData = function(error) {
	console.log(error);
	storage('ssl', SSLAgent.SSL_DISALLOW);
}

window.addEventListener('load', function(){
	window.sslAgent = new SSLAgent();
}, true);
