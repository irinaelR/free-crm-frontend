import { createBrowserRouter} from "react-router-dom";
import Access from "../pages/Access.tsx";
import Home from "../pages/Home.tsx";
import DashboardLayout from "../components/dashboard/DashboardLayout.tsx";

export const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <Access />
    },
    {
        path: "/Home",
        element: <Home />,
        children: [
            {
                index: true,
                path: "Dashboard",
                element: <DashboardLayout />
            }
        ]
    }
]);