
window.GraphicTools = {
	
	/**
	 * @param {ImageData} imgData for example let ImageData = canvas.getContext('2d').getImageData(rectX, 0, rectW, o.IMG_HEIGHT);
	 * @param {Number} width of fragment imgData
	 * @param {Number} height of fragment imgData
	*/
	getImageURL:function(imgData, width, height) {
	   var canvas = document.createElement('canvas');
	   var ctx = canvas.getContext('2d');
	   canvas.width = width;
	   canvas.height = height;
	   ctx.putImageData(imgData, 0, 0);
	   var r = canvas.toDataURL(); //image URL
	   //return canvas.toDataURL(); //image URL
	   delete canvas;
	   return r;
	},
	/**
	 * @param {Image} img
	*/
	imageToDataURL:function(img) {
		var canvas = document.createElement('canvas'),
			ctx,
			r;
		canvas.width = img.naturalWidth; // or 'width' if you want a special/scaled size
		canvas.height = img.naturalHeight; // or 'height' if you want a special/scaled size
		ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		r = canvas.toDataURL(); //image URL
		delete canvas;
		return r;
	}
	
};
