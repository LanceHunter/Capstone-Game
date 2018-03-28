import axios from 'axios';

// const salt = bcrypt.genSatlSync(10);
const baseURL = 'https://gtnwthegame.co/api/stats';
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
        });
    });
  },

  user(username) {
    return new Promise((resolve, reject) => {
      server.get(`/${username}`)
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
