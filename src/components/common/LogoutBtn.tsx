import axiosInstance from "../../api/AxiosConfig.ts";
import {useNavigate} from "react-router";

const LogoutBtn: React.FC = (props) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const userId = sessionStorage.getItem('usrId');
        const response = await axiosInstance.post('/Auth/Logout', { userId });
        if (response.data.code === 200) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            sessionStorage.removeItem('usrId');
            navigate("/Login");
        }
    }

    return (
        <button className="px-4 py-2 rounded bg-blue-300 text-gray-950 cursor-pointer" onClick={handleLogout}>
            Logout
        </button>
    );

}

export default LogoutBtn;