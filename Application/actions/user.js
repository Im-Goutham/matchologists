import axios from 'axios';
import { AsyncStorage } from 'react-native';
// import {API_URL} from '../config'


import {
  SAVE_USER,
} from './types';



export const signIn = (user, callback) => async dispatch => {
  try {

  //  let { data } = await axios.get(API_URL); <- api url from env
  //  await AsyncStorage.setItem('user_data',JSON.stringify(user));
  //  console.log('API_URL is '+API_URL);
    dispatch({ type: SAVE_USER, payload: user });
    callback();
  } catch (error) {
    throw error;
  }
};

// export const likeUser = (user) => {
//   return {
//     payload: user,
//     type: LIKE_USER
//   }
// };
