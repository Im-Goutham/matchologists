// import axios from 'axios';
// import { toast as Toast, ToastContainer } from 'react-toastify';
// import Cookie from './Cookie'
let ApiManager = {
    callapi(fnSucess, fnErr){
        fetch('http://861d941c.ngrok.io/publish', {
            method: 'get',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
            }
        })
        .then((response) => {
            // var obj = JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
            var obj = JSON.parse(response._bodyText);

            return fnSucess(obj.data)
        })
        .catch((error) =>{
            console.error(error);
          });

    }
    
    // callwebservice(methodname, endpoint, data, headerconfig, fnSucess, fnErr) {
    //     let maxRetry = 3;
    //     let currentCall = 1;
    //    var headers = Object.assign({},headerconfig, {"x-csrf-token": Cookie.getCookie("csrf_access_token")});
    //     var xiosConfig = {
    //         method: methodname,
    //         url: endpoint,
    //         data: data,
    //         headers: headers
    //     }
    //     if (currentCall > maxRetry) {
    //         currentCall = 1;
    //         return;
    //     }
    //     else {
    //         currentCall++;
    //     }
    //     var current = this;

    //     return axios(xiosConfig)
    //         .then((response) => {
    //             let { data } = response;
    //             if (data.code == '200') {
    //                 return fnSucess(response);
    //             }
    //             else {
    //                 return fnErr(response);
    //             }
    //         })
    //         .catch(function (error) {               
    //             if ((error && error.response  && error.response.status && error.response.status === 401) || (error && error.response  && error.response.status && error.response.status === 422)) {
    //                 xiosConfig.method = "post",
    //                     xiosConfig.url = `/auth/refresh`;
    //                 xiosConfig.headers = {
    //                     "x-csrf-token": Cookie.getCookie("csrf_refresh_token")
    //                 };
    //                 return axios(xiosConfig)
    //                     .then(response => {
    //                         console.log("response refreshtoken", response)
    //                         current.callwebservice(methodname, endpoint, data, headerconfig, fnSucess, fnErr);
    //                     })
    //                     .catch(function (error) {
    //                         if (error.response.status === 401) {
    //                             return fnErr({status:'relogin', data:{ 
    //                                 methodname: methodname,  
    //                                 endpoint: endpoint,  
    //                                 data: data,  
    //                                 headerconfig: headerconfig
    //                             }});
    //                         }
    //                     })
    //             }
	// 			if(error && error.response && error.response.data)
	// 			{
    //             console.log(error.response.data.msg);
    //             Toast.error(error.response.data.msg);
	// 			}
    //         });
    //       return ;
    // }
}
module.exports = ApiManager;