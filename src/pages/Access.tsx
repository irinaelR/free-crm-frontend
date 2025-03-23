import Bg from '../assets/img/office-bg.jpg';
import Login from "../components/access/Login.tsx";

const Access: React.FC = () => {
    return (
        <div className="w-full min-h-[100vh] flex items-center justify-center bg-cover bg-no-repeat bg-blue-300 bg-blend-multiply" style={{ backgroundImage: `url(${Bg})` }}>
            <Login />
        </div>
    );
}

export default Access;