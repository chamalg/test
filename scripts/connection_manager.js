/**
 * @file
 *
 * @author Shayne Weerakoon
 * @version 1.0
 */
var APPXPRESS = APPXPRESS || {};
APPXPRESS.core = APPXPRESS.core || {};
APPXPRESS.core.connection_manager = APPXPRESS.core.connection_manager || {};
APPXPRESS.core.connection_manager.controller = (function() {
    var connectionManager = {};
    /**
     * Creates an instance of connection manage which will store any common details such as the server URL
     * @param  {String} basePath - The path of the server, can be an url or IP
     * @return {Object}          - A instance of the object containing all the details.
     */
    connectionManager.createConnectionManager = function(basePath,
        framework, lib) {
        var connectionManager = null;
        switch (framework) {
            case 'jquery':
                connectionManager = APPXPRESS.core.connection_manager
                    .jquery.init(basePath);
                break;
            case 'angular':
                connectionManager = APPXPRESS.core.connection_manager
                    .angular.init(basePath, lib);
                break;
            case 'javascript':
                connectionManager = APPXPRESS.core.connection_manager
                    .javascript.init(basePath);
                break;
            default:
                connectionManager = APPXPRESS.core.connection_manager
                    .javascript.init(basePath);

        }
        return connectionManager;

    }
    return connectionManager;

}());

/**
 * @file
 *
 * @author Shayne Weerakoon
 * @version 1.0
 */
var APPXPRESS = APPXPRESS || {};
APPXPRESS.core = APPXPRESS.core || {};
APPXPRESS.core.connection_manager = APPXPRESS.core.connection_manager || {};
APPXPRESS.core.connection_manager.javascript = APPXPRESS.core.connection_manager
    .javascript || {};
APPXPRESS.core.connection_manager.javascript.init = function(basePath) {
    return APPXPRESS.core.connection_manager.javascript.module = (function(
        basePath) {
        var jsManager = {};
        /**
         * Creates an instance of connection manage which will store any common details such as the server URL
         * @param  {String} basePath - The path of the server, can be an url or IP
         * @return {Object}          - A instance of the object containing all the details.
         */
        var connectionManager = {
            basePath: basePath,
        };
        /**
         * Creates and calls the sendRequest () method which executes a HTTP request.
         * @param  {Object} connectionManager - Instance of connection manager
         * @param  {String} httpMethod        - Tested only for GET/POST.
         * @param  {String} endpoint          - The endpoint in the server.
         * @param  {Object} params            - Parameters to be injected into the url. Passed as a key value pair. Refer READMORE for more details.
         * @param  {Object} headers           - Parameters to be passed as headers in the request itself.
         * @param  {Object} body              - The body of the request, null unless required.
         * @param  {Callback} onDataFn        - The function to be executed when data is received
         * @param  {Callback} onErrorFn       - The function to be executed when data is received
         */

        jsManager.createRequest = function(httpMethod, endpoint,
                params,
                headers, body, onDataFn, onErrorFn) {
                var url = prepareUrl(endpoint, params);
                var xmlHttpRequestObj = new XMLHttpRequest();
                try {
                    xmlHttpRequestObj.open(httpMethod, url, true);
                } catch (err) {
                    console.log('err', err);
                }
                xmlHttpRequestObj = insertHeaders(xmlHttpRequestObj,
                    headers);
                sendRequest(xmlHttpRequestObj, body, onDataFn,
                    onErrorFn);
            }
            /**
             * Executes a passed xhr request and then passes the data to an error handler.
             * @param  {XMLHttpRequest} xmlHttpRequestObj - A open xhr object which contains the url and headers.
             * @param  {Object} connectionManager - Instance of connection manager
             * @param  {Object} body              - The body of the request, null unless required.
             * @param  {Callback} onDataFn        - The function to be executed when data is received
             * @param  {Callback} onErrorFn       - The function to be executed when data is received
             */
        function sendRequest(xmlHttpRequestObj, body, onDataFn,
            onErrorFn) {
            xmlHttpRequestObj.onreadystatechange = function() {
                if (this.readyState == 4) {
                    var response = xmlHttpRequestObj.response;
                    var status = xmlHttpRequestObj.status;
                    var statusText = xmlHttpRequestObj.statusText;
                    var responseHeadersObj =
                        getResponseHeadersAsObject(
                            xmlHttpRequestObj.getAllResponseHeaders()
                        );
                    var responseObject = {
                        status: status,
                        statusText: statusText,
                        response: response,
                        responseHeaders: responseHeadersObj
                    };
                    responseObject = formatResponse(
                        responseObject);
                    onDataFn(responseObject);
                }
            };
            try {
                xmlHttpRequestObj.send(JSON.stringify(body));
            } catch (err) {
                console.log('err', err);
            }
        }

        function formatResponse(responseObj) {
            // if (responseObj.responseHeaders['Content-Type']) {
            //     var type = responseObj.responseHeaders['Content-Type']
            //     if (type && type.includes('application/json')) {
            //         responseObj.response = JSON.parse(responseObj.response);
            //         return responseObj;
            //     }
            //     if (type && type.includes('application/xml')) {
            //         //TODO : PARSE STRING TO XML
            //         return responseObj;
            //     }
            // }
            return responseObj;
        }
        /**
         * Formats the response headers and creates an object for easy readability and accessibility(Code Wise)
         * @param  {String} responseHeaders - The headers from the XMLHttpRequest getAllResponseHeaders() method
         * @return {Object}                 - A dynamically created object with the keys being the Header name
         */
        function getResponseHeadersAsObject(responseHeaders) {
            //Since the headers are seperated by a CRLF by default when returned from the getAllResponseHeaders() we can
            //split the string using that as a parameter.
            var match = "\r\n";
            var respArr = responseHeaders.split(match);
            var responseHeadersObject = {};
            //The array of split response headers is then further split into key:value pairs by splitting it with ': '.
            for (var i = 0; i < respArr.length; i++) {
                //the space in ': ' is essential as otherwise the values which have a ":" in them would
                //get split as well.
                respArr[i] = respArr[i].split(': ');
                //dynamically inserting keys into an object.
                responseHeadersObject[respArr[i][0]] = respArr[i][1];
            }
            return responseHeadersObject;
        }
        /**
         * Inserts headers into a XHR. Refer README on more information about the header object.
         * @param  {Object} connectionManager         - Instance of connection manager
         * @param  {XMLHttpRequest} xmlHttpRequestObj - A open xhr object where the headers need to be injected.
         * @param  {Object} headers                   - A object with the keys as the header names.
         * @return {XMLHttpRequest}                   - A open xhr object with the specified header.
         */
        function insertHeaders(xmlHttpRequestObj, headers) {
            if (headers) {
                Object.keys(headers).forEach(function(key) {
                    xmlHttpRequestObj.setRequestHeader(key,
                        headers[key]);
                });
            }
            return xmlHttpRequestObj;
        }
        /**
         * Simply creates the url by concatenating the required data using the passed data.
         * Refer README on more information about the params object.
         * @param  {Object} connectionManager - Instance of connection manager
         * @param  {String} endpoint          - The endpoint in the server the request is supposed to connect to.
         * @param  {Object} params            - The parametrs as an object.S
         * @return {String}                   - A fully created url which can be passed to the XHR object
         */
        function prepareUrl(endpoint, params) {
            var url = connectionManager.basePath;
            if (url[url.length - 1] !== "/") {
                url += "/";
            }
            url += endpoint ? endpoint : "";
            url = params ? insertParams(url, params) : url;
            return url;
        }
        /**
         * Inserts the url parameters
         * @param  {String} url    - The current url
         * @param  {Object} params - The parameters to be added to the url
         * @return {String}        - The url with the parameters inserted.
         */
        function insertParams(url, params) {
            url += "?";
            if (params) {
                Object.keys(params).forEach(function(key) {
                    // url += key + "=" + params[key] + "&";
                    url += encodeURI(key) + "=" + encodeURI(
                        params[key]) + "&";
                });
            }
            url = url.substring(0, url.length - 1);
            return url;
        }
        return jsManager;
    }(basePath));

}
