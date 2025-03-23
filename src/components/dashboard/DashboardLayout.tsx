import { TotalProps } from "../../types/dashboard.ts";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/AxiosConfig.ts";
import TotalCard from "./TotalCard.tsx";
import CampaignCount from "./charts/CampaignCount.tsx";
import CampaignBudget from "./charts/CampaignBudget.tsx";
import {CampaignData} from "../../types/dashboard.ts";
import ExpensesLineChart from "./charts/ExpenseLineChart.tsx";

const DashboardLayout: React.FC = () => {
    const [totalData, setTotalData] = useState<TotalProps[]>([]);
    const [campaignCount, setCampaignCount] = useState<CampaignData>({});

    useEffect(() => {
        const fetchTotals = async () => {
            const response = await axiosInstance.get("/Dashboard/Totals");
            if (response.data) setTotalData(response.data as TotalProps[]);
        }

        fetchTotals();
    }, []);



    return (
        <div className="flex flex-col p-2">
            <div className="flex items-center justify-between gap-4 p-6">
                {totalData.map((item, index) => (
                    <TotalCard key={index} redirect={item.redirect} displayTitle={item.displayTitle} value={item.value} />
                ))}
            </div>
            <div className="flex gap-4 p-6 w-full">
                <div className="flex flex-col gap-4">
                    <CampaignCount />
                    <ExpensesLineChart />
                </div>
                <CampaignBudget />
            </div>
        </div>
    );
}

export default DashboardLayout;