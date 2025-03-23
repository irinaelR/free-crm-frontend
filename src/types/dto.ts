export interface CampaignUpdateRequest {
    Id?: string;
    Title?: string;
    Description?: string;
    TargetRevenueAmount?: number;
    CampaignDateStart?: Date;
    CampaignDateFinish?: Date;
    SalesTeamId?: string;
    Status?: string;
    UpdatedById?: string;
}

export interface BudgetUpdateRequest {
    Id?: string;
    Title?: string;
    Description?: string;
    BudgetDate?: Date;
    Status?: string;
    Amount?: number;
    CampaignId?: string;
    UpdatedById?: string;
}

export interface ExpenseUpdateRequest {
    Id?: string;
    Title?: string;
    Description?: string;
    ExpenseDate?: Date;
    Status?: string;
    Amount?: number;
    CampaignId?: string;
    UpdatedById?: string;
}

export interface DeleteRequest
{
    id: string;
    deletedById?: string;
}