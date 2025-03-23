import {useNavigate} from "react-router";
import {Budget} from "../../types/entities.ts";
import {useEffect, useState} from "react";
import axiosInstance from "../../api/AxiosConfig.ts";
import {FaChevronLeft} from "react-icons/fa6";
import GenericTable from "../common/GenericTable.tsx";
import {BudgetUpdateRequest, DeleteRequest} from "../../types/dto.ts";

const BudgetDetails: React.FC = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    const [budgets, setBudgets] = useState<Budget[]>([]);

    useEffect(() => {
        const fetchBudgetDetails = async () => {
            const response = await axiosInstance.get("/Budget");
            if (response.data) setBudgets(response.data);
        }
        fetchBudgetDetails();
    }, []);

    const tableContents = budgets.map(budget => [
        { value: budget.number, id: budget.id },
        { value: budget.title },
        { value: budget.description },
        { value: new Date(budget.budgetDate) },
        { value: budget.statusName, id: budget.status },
        { value: budget.amount },
        { value: budget.campaignName, id: budget.campaignId },
    ]);

    const handleUpdateBudget = async (rowData:any, newAmount:number) => {
        const updateRequest: BudgetUpdateRequest = {
            id: rowData[0].id,
            title: rowData[1].value,
            description: rowData[2].value,
            budgetDate: rowData[3].value,
            status: rowData[4].id + "",
            amount: newAmount,
            campaignId: rowData[6].id,
            updatedById: null,
        }

        try {
            const response = await axiosInstance.post("/Budget/Update", updateRequest);
            if (response.data.code !== 200) {
                throw new Error('Failed to update budget');
            }

            // Update local state if API call succeeded
            setBudgets(budgets.map(c => {
                if (c.id === rowData[0].id) {
                    return { ...c, amount: newAmount };
                }
                return c;
            }));

        } catch (error) {
            console.error('Error updating budget:', error);
        }
    }

    const handleDeleteBudget = async (rowData: any) => {
        const deleteRequest: DeleteRequest = {
            id: rowData[0].id,
            deletedById: null
        }

        try {
            const response = await axiosInstance.post("/Budget/Delete", deleteRequest);
            if (response.data.code !== 200) {
                throw new Error('Failed to update budget');
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    }

    return (
        <div className="flex flex-col px-6 py-10 gap-4">
            <h1 className="text-4xl mb-4 font-bold uppercase text-blue-950 flex flex-row gap-4"><FaChevronLeft className="cursor-pointer" onClick={goBack} />Budget Details</h1>
            <GenericTable
                headers={["Number", "Title", "Description", "Budget date", "Status", "Amount", "Campaign"]}
                tableContents={tableContents}
                modifiableCol={5}
                onRowUpdate={handleUpdateBudget}
                onRowDelete={handleDeleteBudget}
            />
        </div>
    );
}

export default BudgetDetails;