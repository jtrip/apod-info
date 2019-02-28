import axios from 'axios';

export default axios.create({
    baseURL: 'http://api.caledoniacomics.com',
    // baseURL: 'http://localhost:5000',
    withCredentials: true
});
