// import axios from 'axios';
// import { toast as Toast, ToastContainer } from 'react-toastify';
import { NetInfo } from 'react-native'
import { baseurl as URL } from '../../../app.json';
import RNFetchBlob from 'rn-fetch-blob';

let ApiManager = {
    callapi(fnSucess, fnErr) {
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
            .catch((error) => {
                console.error(error);
            });
    },
    networkConnectivityCheck(){
        NetInfo.isConnected.fetch().then(isConnected => {
            if(!isConnected){
                alert("Internet Connection Not Available")
                return false
            }
          });
          return true    
    },
      
    async callwebservice(methodname, endpoint, header, formBody, fnSucess, fnErr) {
        let maxRetry = 3;
        let currentCall = 1;
        var baseUrl = `${URL}/${endpoint}`;

        // let formBody = [];
        // for (let property in details) {
        //     let encodedKey = encodeURIComponent(property);
        //     let encodedValue = encodeURIComponent(details[property]);
        //     formBody.push(encodedKey + "=" + encodedValue);
        // }
        // formBody = formBody.join("&");
        const config = {
            method: methodname,
            headers: Object.assign({}, header, { 'Content-Type': 'application/json' })
        }
        if (methodname === 'POST') {
            config.body = JSON.stringify(formBody)
        }
        if (currentCall > maxRetry) {
            currentCall = 1;
            return;
        }
        else {
            currentCall++;
        }
        var current = this;
        if(this.networkConnectivityCheck()){
            return await fetch(baseUrl, config)
            .then((response) => { return fnSucess(response) })
            .catch((error) => { return fnErr(error) });
        }

    },

    async callMediaFileUpload(methodname, endpoint, header, details, fnSucess, fnErr) {
        let maxRetry = 3;
        let currentCall = 1;
        var baseUrl = `${URL}/${endpoint}`;

        // let formBody = [];
        // for (let property in details) {
        //     let encodedKey = property;
        //     let encodedValue = details[property];
        //     formBody.push(encodedKey + "=" + encodedValue);
        // }
        // formBody = formBody.join("&");

        console.log("formBody", details)
        const config = {
            method: methodname,
            headers: Object.assign({}, header),
            body: details,
        }
        if (currentCall > maxRetry) {
            currentCall = 1;
            return;
        }
        else {
            currentCall++;
        }
        var current = this;

        return await fetch(baseUrl, config)
            .then((response) => { return fnSucess(response) })
            .catch((error) => { return fnErr(error) });
    },
    callRnFetchblobFileUploader(methodname, endpoint, header, details, progress, fnSucess, fnErr) {
        var baseUrl = `${URL}/${endpoint}`;
        var headers = Object.assign({}, header,  {
            'Accept': 'application/json',
            'Content-Type': 'application/octet-stream'
        })
        let data = []
        let rowData = {}
        rowData.name="file";
        rowData.data = RNFetchBlob.wrap(details.url);
        rowData.type = details.type;
        rowData.filename = details.name;
        data.push(rowData)
        console.log("rowData", data)

        RNFetchBlob.fetch(methodname, baseUrl, headers, data)
            .uploadProgress({ interval: 2 }, (written, total) => {
                console.log("Real Progress:=", written)
                var tempProg = Math.floor(written / total * 100)
                var realProg = (tempProg * 1) / 100
                console.log("realProg:=", realProg)
                // this.setState({
                //     uploadProgress: realProg,
                //     displayProgress: tempProg,
                // })
                console.log('uploaded', Math.floor(written / total * 100) + '%')
                let FileProgress = Math.floor(written / total * 100)
                return progress(FileProgress)
            })
            .then((responseData) => { 
            // console.log("responseData", responseData)
                return fnSucess(responseData)
            })
            .catch((errorMessage, statusCode) => { return fnErr(errorMessage) })
    }
}
module.exports = ApiManager;