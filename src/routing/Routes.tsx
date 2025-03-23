import { createBrowserRouter } from "react-router-dom";
import Access from "../pages/Access.tsx";
import Home from "../pages/Home.tsx";
import DashboardLayout from "../components/dashboard/DashboardLayout.tsx";
import CampaignDetails from "../components/details/CampaignDetails.tsx";
import BudgetDetails from "../components/details/BudgetDetails.tsx";
import ExpenseDetails from "../components/details/ExpenseDetails.tsx";
import { Navigate } from "react-router-dom";
import AlertConfigForm from "../components/alert/AlertConfigForm.tsx";

export const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/Login" replace />
    },
    {
        path: "/Login",
        element: <Access />
    },
    {
        path: "/Access",
        element: <Access />
    },
    {
        path: "/Home",
        element: <Home />,
        children: [
            {
                index: true,
                element: <DashboardLayout />
            },
            {
                path: "Dashboard",
                element: <DashboardLayout />
            },
            {
                path: "Details/Campaign",
                element: <CampaignDetails />
            },
            {
                path: "Details/Budget",
                element: <BudgetDetails />
            },
            {
                path: "Details/Expense",
                element: <ExpenseDetails />
            },
            {
                path: "AlertConfig",
                element: <AlertConfigForm />
            }
        ]
    }
]);