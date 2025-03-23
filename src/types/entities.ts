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

export interface Status {
    id: string;
    name: string;
}