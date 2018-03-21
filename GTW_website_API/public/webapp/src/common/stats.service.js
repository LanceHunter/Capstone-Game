import axios from 'axios';
import auth from './auth.service';

// const salt = bcrypt.genSatlSync(10);
const baseURL = 'http://localhost:3000/api/stats';
const server = axios.create({
  baseURL,
});

const StatsService = {
  leaders(order) {
    return new Promise((resolve, reject) => {
      server.get(`/leaders?order=${order}`)
        .then((response) => {
          resolve(response.data.leaders);
        })
        .catch((error) => {
          reject(error);
        })
    })
  },

  user() {
    let username = auth.getUser();
    return new Promise((resolve, reject) => {
      server.get(`/${username}`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    })
  },
};

export default StatsService;
