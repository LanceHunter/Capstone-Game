import axios from 'axios';

const server = axios.create();

const AuthService = {
  login(username, password) {
    return new Promise((resolve, reject) => {
      server.post('/api/login', {
        username,
        password,
      })
        .then((response) => {
          localStorage.setItem('username', username);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  create(username, password) {
    return new Promise((resolve, reject) => {
      server.post('/api/register', {
        username,
        password,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  logout() {
    localStorage.removeItem('username');
  },

  getUser() {
    return localStorage.getItem('username');
  },

  isLoggedIn() {
    return !!localStorage.getItem('username');
  },
};

export default AuthService;
