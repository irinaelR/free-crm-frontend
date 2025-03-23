import axios from 'axios';
import Swal from 'sweetalert2';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 30000,
});

// Axios response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            const data = error.response.data;
            if (data && data.redirect) {
                // Show Swal notification before redirecting
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Your session has expired. You will be redirected to the login page.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true
                }).then(() => {
                    // Redirect after Swal is closed or timer completes
                    window.location.href = data.redirect;
                });

                return new Promise(() => {}); // Block further processing
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;