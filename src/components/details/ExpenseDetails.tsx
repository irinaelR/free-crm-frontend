import {useNavigate} from "react-router";
import {Expense} from "../../types/entities.ts";
import {useState,useEffect} from "react";
import axiosInstance from "../../api/AxiosConfig.ts";
import {FaChevronLeft} from "react-icons/fa6";
import GenericTable from "../common/GenericTable.tsx";
import {DeleteRequest, ExpenseUpdateRequest} from "../../types/dto.ts";

const ExpenseDetails: React.FC = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    const [expenses, setExpenses] = useState<Expense[]>([]);
    useEffect(() => {
        const fetchExpenseDetails = async () => {
            const response = await axiosInstance.get("/Expense");
            if (response.data) setExpenses(response.data);
        }

        fetchExpenseDetails();
    }, []);

    const tableContents = expenses.map(expense => [
        { value: expense.number, id: expense.id },
        { value: expense.title },
        { value: expense.description },
        { value: new Date(expense.expenseDate) },
        { value: expense.statusName, id: expense.status },
        { value: expense.amount },
        { value: expense.campaignName, id: expense.campaignId },
    ]);

    const handleUpdateExpense = async (rowData: any, newAmount: number) => {
        const updateRequest: ExpenseUpdateRequest = {
            id: rowData[0].id,
            title: rowData[1].value,
            description: rowData[2].value,
            expenseDate: rowData[3].value,
            status: rowData[4].id + "",
            amount: newAmount,
            campaignId: rowData[6].id,
            updatedById: null
        }

        try {
            const response = await axiosInstance.post("/Expense/Update", updateRequest);
            if (response.data.code !== 200) {
                throw new Error('Failed to update expense');
            }
            // Update local state if API call succeeded
            setExpenses(expenses.map(c => {
                if (c.id === rowData[0].id) {
                    return { ...c, amount: newAmount };
                }
                return c;
            }));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }
    const handleDeleteExpense = async (rowData: any) => {
        const deleteRequest: DeleteRequest = {
            id: rowData[0].id,
            deletedById: null
        }

        try {
            const response = await axiosInstance.post("/Expense/Delete", deleteRequest);
            if (response.data.code !== 200) {
                throw new Error('Failed to update expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }

    return (
        <div className="flex flex-col px-6 py-10 gap-4">
            <h1 className="text-4xl mb-4 font-bold uppercase text-blue-950 flex flex-row gap-4"><FaChevronLeft className="cursor-pointer" onClick={goBack} />Expense Details</h1>
            <GenericTable
                headers={["Number", "Title", "Description", "Expense Date", "Status", "Amount", "Campaign"]}
                tableContents={tableContents}
                modifiableCol={5}
                onRowUpdate={handleUpdateExpense}
                onRowDelete={handleDeleteExpense}
            />
        </div>
    );
}

export default ExpenseDetails;