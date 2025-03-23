import React, {useEffect, useState} from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent } from '@mui/material';
import { CampaignData } from "../../../types/dashboard.ts";
import { Status } from "../../../types/entities.ts";
import axiosInstance from "../../../api/AxiosConfig.ts";
import { PB_PALETTE } from "../../../assets/colors.ts";

const CampaignCount: React.FC = () => {

    
    const legend = {
        legend: {
            direction: 'column',
            position: { vertical: 'middle', horizontal: 'right' },
            padding: 0,
            itemMarkWidth: 10,
            itemMarkHeight: 10,
            markGap: 5,
            itemGap: 10,
            labelStyle: {
                fontSize: 12,
            },
        },
    };

    const mapDataForPieChart = (data: Record<string, number>) => {
        return Object.entries(data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value]) => value > 0) // Optional: filter out zero values
            .map(([key, value], index) => ({
                id: index, 
                value,
                label: key
            }));
    };
    
    const [campaignCount, setCampaignCount] = useState<CampaignData>({});
    const [status, setStatus] = useState<number>(-1);
    const [campaignStatuses, setCampaignStatuses] = useState<Status[]>([]);

    const handleStatusChange = (event) => {
        setStatus(Number(event.target.value));
    };

    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await axiosInstance.get("/Campaign/Status");
            if (response.data) setCampaignStatuses(response.data);
        }

        fetchStatuses();
    }, []);

    useEffect(() => {
        const fetchCampaignCount = async () => {
            const response = await axiosInstance.post("/Dashboard/CampaignCountPerTeam", status, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.data) setCampaignCount(response.data as CampaignData);
        }

        fetchCampaignCount();
    }, [status]);

    const mappedData = mapDataForPieChart(campaignCount);

    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex flex-row w-full justify-between items-center p-3">
                    <h4 className="font-bold mb-2">Campaign count per sales team</h4>
                    <select
                        value={status}
                        onChange={handleStatusChange}>
                            <option value={-1}>All statuses</option>
                            {campaignStatuses.map((s, index) => (
                                <option key={index} value={s.id}>{s.name}</option>
                            ))}
                    </select>
                </div>
                <PieChart
                    series={[
                        {
                            data: mappedData,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, color: 'gray' },
                            arcLabelMinAngle: 0,
                            cx: 150,
                            cy: 100,
                            innerRadius: 10,
                            outerRadius: 100,
                            paddingAngle: 2,
                            cornerRadius: 4,
                        },
                    ]}
                    colors={PB_PALETTE}
                    width={400}
                    height={300}
                    margin={{ left: 0, right: 0, top: 50, bottom: 0 }}
                    slotProps={{
                        ...legend,
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default CampaignCount;