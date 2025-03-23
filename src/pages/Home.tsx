import AuthorizedRoute from "../routing/AuthorizedRoute.tsx";
import {Outlet} from "react-router-dom";
import Navbar from "../components/common/Navbar.tsx";

const Home: React.FC = () => {
    return (
        <AuthorizedRoute>
            <Navbar></Navbar>
            <Outlet />
        </AuthorizedRoute>
    );
}

export default Home;