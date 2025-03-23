import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, CardContent } from '@mui/material';
import axiosInstance from "../../../api/AxiosConfig.ts";
import { PU_PALETTE } from "../../../assets/colors.ts";
import { Status } from "../../../types/entities.ts";

// Define the data structure for expenses
type ExpensesData = Record<string, number>;

// Define the request DTO
interface ExpenseSumArgsDTO {
    year: number;
    status: number | null;
}

const ExpensesLineChart: React.FC = () => {
    const [expensesData, setExpensesData] = useState<ExpensesData>({});
    const [status, setStatus] = useState<number>(-1);
    const [year, setYear] = useState<number>(2024);
    const [expenseStatuses, setExpenseStatuses] = useState<Status[]>([]);

    const handleStatusChange = (event) => {
        setStatus(Number(event.target.value));
    };

    const handleYearChange = (event) => {
        setYear(Number(event.target.value));
    };

    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await axiosInstance.get("/Expense/Status");
            if (response.data) setExpenseStatuses(response.data);
        }

        fetchStatuses();
    }, []);

    useEffect(() => {
        const fetchExpensesData = async () => {
            const requestBody: ExpenseSumArgsDTO = {
                year: year,
                status: status === -1 ? null : status
            };

            const response = await axiosInstance.post("/Dashboard/ExpensesSumPerMonth", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.data) setExpensesData(response.data as ExpensesData);
        }

        fetchExpensesData();
    }, [status, year]);

    // Format data for the LineChart
    const xAxisData = Array.from({ length: 12 }, (_, i) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[i];
    });

    const yAxisData = Array.from({ length: 12 }, (_, i) => {
        const monthKey = (i + 1).toString();
        return expensesData[monthKey] || 0;
    });

    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex flex-row w-full justify-between items-center p-3">
                    <h4 className="font-bold mb-2">Expenses Sum Per Month</h4>
                    <div className="flex gap-3">
                        <div>
                            <label htmlFor="year" className="mr-2">Year:</label>
                            <input
                                id="year"
                                type="number"
                                value={year}
                                onChange={handleYearChange}
                                min="2000"
                                max="2050"
                                className="w-20 px-2 py-1 border rounded"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={handleStatusChange}>
                            <option value={-1}>All statuses</option>
                            {expenseStatuses.map((s, index) => (
                                <option key={index} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <LineChart
                    series={[
                        {
                            data: yAxisData,
                            label: 'Expenses',
                            color: PU_PALETTE[0],
                            curve: "linear",
                            showMark: true,
                        }
                    ]}
                    xAxis={[
                        {
                            data: xAxisData,
                            scaleType: 'band',
                        }
                    ]}
                    width={400}
                    height={300}
                    margin={{ left: 70, right: 20, top: 50, bottom: 30 }}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'top', horizontal: 'center' },
                            padding: 0,
                            itemMarkWidth: 10,
                            itemMarkHeight: 10,
                            markGap: 5,
                            itemGap: 10,
                            labelStyle: {
                                fontSize: 12,
                            },
                        }
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default ExpensesLineChart;