class Request {

    static post(url, data) {
        let nameEQ = "csrftoken" + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) ca = c.substring(nameEQ.length, c.length);
        }
        let conf = {
            method: "POST",
            body: data,
            headers: {"X-CSRFToken": ca}
        };
        return fetch(window.location.protocol + "//" + window.location.host + "/" + url, conf);
    }

    static get(url, data = undefined) {
        let urlend = "";
        if (data !== undefined) {
            urlend = "?";
            for (let elem in data) {
                urlend += elem + "=" + data[elem] + "&";
            }
            urlend = urlend.slice(0, -1);
        }
        return fetch(window.location.protocol + "//" + window.location.host + "/" + url + urlend);
    }
}

export default Request;