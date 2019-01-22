import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'https://react-my-burger-c2019.firebaseio.com/'
  });
   
  // Alter defaults after instance has been created
  //instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

  export default instance;