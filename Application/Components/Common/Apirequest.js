import ApiManager from "./ApiManager";
const ApiRequest = {
    visitProfile(token, userId ){
        let header = {
            'Authorization': token,
        }
        let data = {
            "profileUserId": userId
        }
        ApiManager.callwebservice('POST', 'api/addVisitedProfileUser', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return
            } else if (response.status === 1) {
            }
        }, (error) => {
            console.log("error", error)
        })
    },
    addToFavourite(token, userId, resolve, reject){
        let header = {
            'Authorization': token,
        }
        let data = {
            "profileUserId": userId
        }
        ApiManager.callwebservice('POST', 'api/addToFavourite', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            // console.log("addVisitedProfileUser", response)
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error", error)
        })

    },
    pokeUser(token, userId, resolve, reject){
        let header = {
            'Authorization': token,
        }
        let data = {
            "profileUserId": userId
        }
        ApiManager.callwebservice('POST', 'api/pokeUser', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("pokeUser", response)
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error", error)
        })
    },
    sendFriendRequest(token, userId, resolve, reject){
        let header = {
            'Authorization': token,
        }
        let data = {
            "profileUserId": userId
        }
        ApiManager.callwebservice('POST', 'api/sendFriendRequest', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error", error)
        })
    },
    getChatSessionId(token, userid, resolve, reject){
        let header = {
            'Authorization': token,
        }
        let data = {
            "chatReceiverId": userid
        }
        console.log("Authorization", header);
        console.log("Authorization_data", data);
        ApiManager.callwebservice('POST', 'api/getChatSessionId', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error", error)
        })
    },
    sortAndFilterUsers(token,  resolve, reject){
        let header = {
            'Authorization': token,
        }
        let data = {}
        // console.log("Authorization", header);
        // console.log("Authorization_data", data);
        ApiManager.callwebservice('POST', 'api/sortAndFilterUsers', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error", error)
        })
    },
    getNotifications(token,  resolve, reject){
        let header = {
            'Authorization': token,
        }
        ApiManager.callwebservice('GET', 'api/getNotifications', header, '', (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error", error)
        })
    },
    getFeedbackQuestions(token,invitefeedback,  resolve, reject){
        let header = {
            'Authorization': token,
        }
        ApiManager.callwebservice('GET', `api/getFeedbackQuestions${"/"+invitefeedback}`, header, '', (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error", error)
        })
    },
    saveUserFeedback(token, data ,resolve, reject){
        let header = {
            'Authorization': token,
        }
        ApiManager.callwebservice('POST', 'api/saveUserFeedback', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error", error)
        })
    },
}
module.exports=ApiRequest