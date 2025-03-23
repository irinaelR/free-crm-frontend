import AuthorizedRoute from "../routing/AuthorizedRoute.tsx";
import {Outlet} from "react-router-dom";

const Home: React.FC = () => {
    return (
        <AuthorizedRoute>
            <Outlet />
        </AuthorizedRoute>
    );
}

export default Home;