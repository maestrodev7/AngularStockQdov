export interface TransfertFilter {
    startDate?: string;
    endDate?: string;
    fromType?: 'STORE' | 'SHOP';
    fromId?: number;
    toType?: 'STORE' | 'SHOP';
    toId?: number;
}
