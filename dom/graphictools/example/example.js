function init() {
	bToUrl.onclick = onClick;
}
function onClick() {
	let data = GraphicTools.imageToDataURL(imgExample);
	strdata.value = data;
	imgExampleOut.setAttribute('src', data);
}

window.onload=init;
