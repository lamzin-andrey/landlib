window.Rest = {
	/**
	 * @property {String} csrf token, set it from app
	*/
	_token : '',
	/**
	 * @property {String} _lang
	*/
	_lang : '',
	root : '',
	/**
     * @description ajax post request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _post:function(data, onSuccess, url, onFail) {
        var t = this._getToken();
        if (t) {
            data._token = t;
            this._restreq('post', data, onSuccess, url, onFail)
        }
	},
	/**
     * @description ajax post request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _put:function(data, onSuccess, url, onFail) {
        var t = this._getToken();
        if (t) {
            data._token = t;
            this._restreq('put', data, onSuccess, url, onFail)
        }
	},
	/**
     * @description ajax patch request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _patch:function(data, onSuccess, url, onFail) {
        var t = this._getToken();
        if (t) {
            data._token = t;
            this._restreq('patch', data, onSuccess, url, onFail)
        }
	},
	/**
     * @description ajax delte request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _delete:function(data, onSuccess, url, onFail) {
        var t = this._getToken();
        if (t) {
            data._token = t;
            this._restreq('delete', data, onSuccess, url, onFail)
        }
	},
	/**
     * @description ajax get request (FormData)
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _get:function(onSuccess, url, onFail) {
        this._restreq('get', {}, onSuccess, url, onFail)
	},
	/**
     * @description get asrf token
	 * @return String
     */
    _getToken:function() {
        return this._token;
	},
	/**
     * @description ajax request (FormData).
	 * @param {String} method 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _restreq:function(method, data, onSuccess, url, onFail) {
		var sendData = data;
        if (!url) {
            url = window.location.href;
        } else {
            url = this.root + url;
        }
        if (!onFail) {
            onFail = defaultFail;
        }
        /*switch (method) {
            case 'put':
            case 'patch':
            case 'delete':
                break;
		}*/
		if (this._lang && !sendData.lang) {
			sendData.lang = this._lang;
		}
        $.ajax({
            method: method,
            data:sendData,
            url:url,
            dataType:'json',
            success:onSuccess,
            error:onFail
        });
        
	},
};
