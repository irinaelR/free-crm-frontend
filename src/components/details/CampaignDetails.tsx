import GenericTable from "../common/GenericTable.tsx";
import {Campaign} from "../../types/entities.ts";
import {CampaignUpdateRequest, DeleteRequest} from "../../types/dto.ts";
import {useEffect, useState} from "react";
import axiosInstance from "../../api/AxiosConfig.ts";
import {FaChevronLeft} from "react-icons/fa6";
import {useNavigate} from "react-router";

const CampaignDetails : React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    useEffect(() => {
        const fetchCampaigns = async () => {
            const response = await axiosInstance.get("/Campaign");
            if (response.data) setCampaigns(response.data);
        }

        fetchCampaigns();
    }, []);

    const handleUpdateCampaign = async (rowData: any, newAmount: number) => {
        const updateRequest: CampaignUpdateRequest = {
            id: rowData[0].id,
            title: rowData[0].value,
            description: rowData[1].value,
            targetRevenueAmount: newAmount, // The modified amount
            campaignDateStart: rowData[3].value,
            campaignDateFinish: rowData[4].value,
            status: rowData[5].id + "", // Converting number to string
            salesTeamId: rowData[6].id,
            updatedById: null
        };

        try {
            const response = await axiosInstance.post("/Campaign/Update", updateRequest);
            if (response.data.code !== 200) {
                throw new Error('Failed to update campaign');
            }

            // Update local state if API call succeeded
            setCampaigns(campaigns.map(c => {
                if (c.id === rowData[0].id) {
                    return { ...c, targetRevenueAmount: newAmount };
                }
                return c;
            }));

        } catch (error) {
            console.error('Error updating campaign:', error);
        }
    };

    const handleDeleteCampaign = async (rowData: any) => {
        const deleteRequest: DeleteRequest = {
            id: rowData[0].id,
            deletedById: null,
        };

        try {
            const response = await axiosInstance.post("/Campaign/Delete", deleteRequest);
            if (response.data.code !== 200) {
                throw new Error('Failed to update campaign');
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
        }
    }

    // Transform campaigns data to table format
    const tableContents = campaigns.map(campaign => [
        { value: campaign.title, id: campaign.id },
        { value: campaign.description },
        { value: campaign.targetRevenueAmount },
        { value: new Date(campaign.campaignDateStart) },
        { value: new Date(campaign.campaignDateFinish) },
        { value: campaign.statusName, id: campaign.status },
        { value: campaign.salesTeamName, id: campaign.salesTeamId },
    ]);

    return (
        <div className="flex flex-col px-6 py-10 gap-4">
            <h1 className="text-4xl mb-4 font-bold uppercase text-blue-950 flex flex-row gap-4"><FaChevronLeft className="cursor-pointer" onClick={goBack} />Campaign Details</h1>
            <GenericTable
                headers={["Title", "Description", "Target Revenue Amount", "Campaign Start Date", "Campaign Finish Date", "Status", "Sales team"]}
                tableContents={tableContents}
                modifiableCol={2}
                onRowUpdate={handleUpdateCampaign}
                onRowDelete={handleDeleteCampaign}
            />
        </div>
    );
}

export default CampaignDetails;