import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card, CardContent } from '@mui/material';
import { CampaignData } from "../../../types/dashboard.ts";
import { Status } from "../../../types/entities.ts";
import axiosInstance from "../../../api/AxiosConfig.ts";
import { MO_PALETTE } from "../../../assets/colors.ts";

const CampaignBudget: React.FC = () => {
    const [budgetData, setBudgetData] = useState<CampaignData>({});
    const [status, setStatus] = useState<number>(-1);
    const [budgetStatuses, setBudgetStatuses] = useState<Status[]>([]);

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(Number(event.target.value));
    };

    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await axiosInstance.get("/Budget/Status");
            if (response.data) setBudgetStatuses(response.data);
        }

        fetchStatuses();
    }, []);

    useEffect(() => {
        const fetchBudgetData = async () => {
            const response = await axiosInstance.post("/Dashboard/BudgetAmountsPerCampaign", status, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.data) setBudgetData(response.data as CampaignData);
        }

        fetchBudgetData();
    }, [status]);

    const mapDataForBarChart = (data: Record<string, number>) => {
        return Object.entries(data)
            .filter(([_, value]) => value > 0) // Filter out zero values
            .map(([key, value]) => ({
                name: key,
                value: value
            }));
    };

    const mappedData = mapDataForBarChart(budgetData);

    // Ensure we have colors for each data point
    const getItemColor = (index: number) => {
        return MO_PALETTE[index % MO_PALETTE.length];
    };

    return (
        <Card className="w-2/3 h-max rounded-xl">
            <CardContent>
                <div className="flex flex-row w-full justify-between items-center p-3">
                    <h4 className="font-bold mb-2">Budgets per campaign</h4>
                    <select
                        value={status}
                        onChange={handleStatusChange}>
                        <option value={-1}>All statuses</option>
                        {budgetStatuses.map((s, index) => (
                            <option key={index} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                {mappedData.length > 0 ? (
                    <BarChart
                        dataset={mappedData.map((item, index) => ({
                            ...item,
                        }))}
                        layout="horizontal"
                        yAxis={[{
                            scaleType: 'band',
                            dataKey: 'name',
                            tickLabelStyle: {
                                fontSize: 12
                            },
                            colorMap: {
                                type: 'ordinal',
                                colors: MO_PALETTE
                            }
                        }]}
                        xAxis={[{
                            //label: 'Budget Amount'
                        }]}
                        series={[{
                            dataKey: 'value',
                        }]}
                        width={950}
                        height={Math.max(400, mappedData.length * 40)} // Dynamic height based on number of items
                        margin={{ left: 220, right: 80, top: 20, bottom: 30 }}
                        slotProps={{
                            bar: {
                                // Set opacity for non-highlighted state
                                style: {
                                    cursor: 'pointer'
                                },
                                // Override the default highlight/fade behavior
                                onMouseEnter: () => {},
                                onMouseLeave: () => {}
                            },
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <p>No budget data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CampaignBudget;