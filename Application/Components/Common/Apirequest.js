import ApiManager from "./ApiManager";
const ApiRequest = {
    visitProfile(token, userId) {
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
            console.log("error_visitProfile", error)
        })
    },
    changePassword(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
        }
        ApiManager.callwebservice('POST', 'api/changePassword', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            // console.log("addVisitedProfileUser", response)
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_changePassword", error)
        })
    },
    addToFavourite(token, userId, resolve, reject) {
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
            console.log("error_addToFavourite", error)
        })

    },
    pokeUser(token, userId, resolve, reject) {
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
            console.log("error_pokeUser", error)
        })
    },
    sendFriendRequest(token, userId, resolve, reject) {
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
            console.log("error_sendFriendRequest", error)
        })
    },
    getChatSessionId(token, userid, resolve, reject) {
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
            console.log("error_getChatSessionId", error)
        })
    },
    sortAndFilterUsers(token, resolve, reject) {
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
            console.log("error_sortAndFilterUsers", error)
            return reject(error);
        })
    },
    getNotifications(token, resolve, reject) {
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
            console.log("error_getNotifications", error)
        })
    },
    getFeedbackQuestions(token, invitefeedback, resolve, reject) {
        let header = {
            'Authorization': token,
        }
        ApiManager.callwebservice('GET', `api/getFeedbackQuestions${"/" + invitefeedback}`, header, '', (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getFeedbackQuestions", error)
        })
    },
    saveUserFeedback(token, data, resolve, reject) {
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
            console.log("error_saveUserFeedback", error)
        })
    },
    updateNotificationStatus(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
        }
        ApiManager.callwebservice('POST', 'api/updateNotificationStatus', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_updateNotificationStatus", error)
        })
    },
    saveUserSettings(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
        }
        ApiManager.callwebservice('POST', 'api/saveUserSettings', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_saveUserSettings", error)
        })
    },
    getFavouriteUsers(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
        }
        ApiManager.callwebservice('GET', 'api/getFavouriteUsers', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getFavouriteUsers", error)
        })
    },
    addFavouriteUserAsMonogamous(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
        }
        ApiManager.callwebservice('POST', 'api/addFavouriteUserAsMonogamous', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_addFavouriteUserAsMonogamous", error)
        })
    },
    removeFavouriteUser(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        // console.log("api/removeFavouriteUser", header)
        // console.log("api/removeFavouriteUser_data", data)
        ApiManager.callwebservice('POST', 'api/removeFavouriteUser', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            // console.log("success_removeFavouriteUser",response)
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_removeFavouriteUser", error)
        })
    },
    removeMonogamousUser(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/removeMonogamousUser', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_removeMonogamousUser", error)
        })
    },
    // new call
    askVideoCallPermission(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/askVideoCallPermission', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_askVideoCallPermission", error)
        })
    },
    respondToVideoCallPermission(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/respondToVideoCallPermission', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_respondToVideoCallPermission", error)
        })
    },
    reportUser(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/reportUser', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_reportUser", error)
        })
    },
    startArchive(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/startArchive', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_startArchive", error)
        })

    },
    changeChatStatus(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/changeChatStatus', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_changeChatStatus", error)
        })
    },
    startArchive(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/startArchive', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_startArchive", error)
            return reject(error);
        })
    },
    stopArchive(token, data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/stopArchive', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return reject(response);
            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_stopArchive", error)
            return reject(error);
        })
    },
    getSpeedDatingEvents(token, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('GET', 'api/getSpeedDatingEvents', header, '', (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            if (response.status === 0) {
                return reject(response);

            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getSpeedDatingEvents", error)
            return reject(error);
        })
    },
    getMatchPercentage(token, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('GET', 'api/getMatchPercentage', header, '', (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            if (response.status === 0) {
                return reject(response);

            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getSpeedDatingEvents", error)
            return reject(error);
        })
    },
    sendNotificationForVideoCall(token, Data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/sendNotificationForVideoCall', header, Data, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            if (response.status === 0) {
                return reject(response);

            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getSpeedDatingEvents", error)
            return reject(error);
        })
    },
    inviteUserForSpeedDatingEvent(token, Data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/inviteUserForSpeedDatingEvent', header, Data, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            if (response.status === 0) {
                return reject(response);

            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getSpeedDatingEvents", error)
            return reject(error);
        })
    },
    rsvpForSpeedDating(token, Data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/rsvpForSpeedDating', header, Data, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            if (response.status === 0) {
                return reject(response);

            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getSpeedDatingEvents", error)
            return reject(error);
        })
    },
    cancleRSVPForSpeedDatingEvent(token, Data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/rsvpForSpeedDating', header, Data, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            if (response.status === 0) {
                return reject(response);

            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getSpeedDatingEvents", error)
            return reject(error);
        })
    },
    isUserFriend(token, Data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/isUserFriend', header, Data, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            if (response.status === 0) {
                return reject(response);

            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getSpeedDatingEvents", error)
            return reject(error);
        })
    },
    getUsersPairForSpeedDating(token, Data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/getUsersPairForSpeedDating', header, Data, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            if (response.status === 0) {
                return reject(response);

            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getSpeedDatingEvents", error)
            return reject(error);
        })
    },
    generateSessionIdAgain(token, Data, resolve, reject) {
        let header = {
            'Authorization': token,
            'Content-Type': "application/json"
        }
        ApiManager.callwebservice('POST', 'api/generateSessionIdAgain', header, Data, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            if (response.status === 0) {
                return reject(response);

            } else if (response.status === 1) {
                return resolve(response);
            }
        }, (error) => {
            console.log("error_getSpeedDatingEvents", error)
            return reject(error);
        })
    }
}
module.exports = ApiRequest