async function root(r) {
    try {
        r.headersOut['Access-Control-Allow-Origin'] = '*';
        r.headersOut['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        r.headersOut['Access-Control-Allow-Headers'] =
            'Content-Type, Authorization, Cookie, X-Original-URI, X-Original-Method, User-Agent, Accept, Accept-Language';

        const method = r.method;
        const contentType = r.headersIn['Content-Type'] || 'application/json';
        let requestBody = r.requestText;
        let bodyObj;
        if (contentType.includes('application/json') && requestBody) {
            try {
                bodyObj = JSON.parse(requestBody);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                bodyObj = null; 
            }
        } else {
            bodyObj = requestBody;
        }
        
        let originalHeaders = {};
        for (let k in r.headersIn) {
            originalHeaders[k] = r.headersIn[k];
        }
        let jsonString = JSON.stringify(originalHeaders);
        originalHeaders = jsonString.replace(/\"([^"]+)\":/g, "'$1':")
                                .replace(/: \"(.*?)\"/g, ": '$1'");


        const authResponse = await ngx.fetch('http://127.0.0.1:8082/authstream/permissioncheck', {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json', 
                "X-Original-URI" : `${r.uri}`, 
                "X-Original-Method" : `${r.method}`,
                "Cookie" : `${r.headersIn['Cookie']}`,
                "Authorization" : `${r.headersIn['Authorization']}`
            },
            body: JSON.stringify(r.requestText)
        });

        let a = await authResponse.text();
        r.log('Auth server response status: ' + authResponse.status);
        r.return(200, a)
        let authBody;
        const authContentType = authResponse.headers.get('Content-Type') || 'text/plain';
        if (authContentType && authContentType.includes('application/json')) {
            authBody = await authResponse.json();
            r.log('Auth server response body: ' + JSON.stringify(authBody));
        } else {
            authBody = await authResponse.text();
            r.log('Auth server response body: ' + authBody);
        }

        if (authResponse.status >= 200 && authResponse.status <= 500) {
            let backendRequestBody;
            if (authContentType.includes('application/json') && typeof authBody === 'object') {
                backendRequestBody = JSON.stringify(authBody);
            } else {
                backendRequestBody = authBody;
            }

            const backendResponse = await ngx.fetch('http://127.0.0.1:8081' + r.uri, {
                method: method,
                headers: {
                    'Content-Type': authContentType,
                },
                body: backendRequestBody,
            });

            r.log('Backend response status: ' + backendResponse.status);
            let responseData;
            const backendContentType = backendResponse.headers.get('Content-Type') || 'text/plain';
            if (backendContentType.includes('application/json')) {
                responseData = await backendResponse.json();
                r.log('Backend response body: ' + JSON.stringify(responseData));
                r.return(backendResponse.status, JSON.stringify(responseData));
            } else {
                responseData = await backendResponse.text();
                r.log('Backend response body: ' + responseData);
                r.return(backendResponse.status, 'FTU ' + responseData);
            }
        } else {AUTH
            r.return(backendResponse.status, JSON.stringify(authBody));
        }
    } catch (error) {
        r.headersOut['Access-Control-Allow-Origin'] = '*';
        r.headersOut['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        r.headersOut['Access-Control-Allow-Headers'] =
            'Content-Type, Authorization, Cookie, X-Original-URI, X-Original-Method, User-Agent, Accept, Accept-Language';
        r.return(500, 'Error: ' + error.message);
    }
}

export default { root };