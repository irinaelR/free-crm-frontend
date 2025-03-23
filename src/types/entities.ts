    export interface Campaign {
        id: string;
        number: string;
        title: string;
        description: string;
        targetRevenueAmount: number;
        campaignDateStart: Date;
        campaignDateFinish: Date;
        status: number;
        statusName: string;
        salesTeamId: string;
        salesTeamName: string;
        createdAtUtc: Date;
    }

export interface Budget {
    id: string;
    number: string;
    title: string;
    description: string;
    budgetDate: Date;
    status: number;
    statusName: string;
    amount: number;
    campaignId: string;
    campaignName: string;
    createdAtUtc: Date;
}

export interface Expense {
    id: string;
    number: string;
    title: string;
    description: string;
    expenseDate: Date;
    status: number;
    statusName: string;
    amount: number;
    campaignId: string;
    campaignName: string;
    createdAtUtc: Date;
    updatedById: string;
}

export interface AlertConfig {
    id: string;
    percentage: number;
    dateAdded: Date;
    dateUpdated: Date;
}

export interface Status {
    id: string;
    name: string;
}