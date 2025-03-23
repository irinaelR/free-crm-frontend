import axiosInstance from "../../api/AxiosConfig.ts";
import React, { useState } from 'react';
import {useNavigate} from "react-router";
import Swal from 'sweetalert2';

const Login: React.FC = () => {
    const [email, setEmail] = useState('admin@root.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post('/Auth/Login', {
                email,
                password
            });

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            // sessionStorage.setItem('usrId', response.data.id);

            const fullName = response.data?.firstName + ' ' + response.data?.lastName;
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: `Welcome ${fullName}! You will be redirected to home shortly.`,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                // Redirect to Home after the alert closes
                navigate('/Home');
            });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid email or password. Please try again.',
                confirmButtonColor: '#3085d6'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-white text-6xl font-black">Free CRM</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md py-6 px-10 mt-3 flex flex-col items-center">
                <h2 className="text-2xl uppercase text-gray-800 font-semibold mb-2">Login</h2>
                <div className="flex flex-col items-start w-full mb-4 gap-2">
                    <label className="text-gray-800">Email</label>
                    <input
                        type="email"
                        className="w-full border border-gray-500 rounded-sm h-10 p-6"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col items-start w-full mb-4 gap-2">
                    <label className="text-gray-800">Password</label>
                    <input
                        type="password"
                        className="w-full border border-gray-500 rounded-sm h-10 p-6"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-blue-50 px-6 py-4 w-full rounded-sm cursor-pointer flex justify-center items-center"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                             role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : 'Log In'}
                </button>
            </form>
        </div>
    );
}

export default Login;