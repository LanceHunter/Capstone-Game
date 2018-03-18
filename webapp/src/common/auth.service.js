import axios from 'axios';

// const salt = bcrypt.genSatlSync(10);
const baseURL = 'http://localhost:3000/api';
const server = axios.create({
  baseURL,
});

const AuthService = {
  login(username, password) {
    return server.post('/login', {
      username,
      password,
    })
      .then((response) => {
        localStorage.setItem('username', 'username');
        return response;
      })
      .catch(error => error);
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
