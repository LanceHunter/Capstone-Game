import axios from 'axios';

const server = axios.create();

const StatsService = {
  leaders(order) {
    return new Promise((resolve, reject) => {
      server.get(`/api/stats/leaders?order=${order}`)
        .then((response) => {
          resolve(response.data.leaders);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  user(username) {
    return new Promise((resolve, reject) => {
      server.get(`/api/stats/${username}`)
        .then((response) => {
          resolve(response.data.stats);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default StatsService;
