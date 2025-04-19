export interface Transfert {
    id: number;
    produitId: number;
    fromLocationType: 'STORE' | 'SHOP';
    fromLocationId: number;
    toLocationType: 'STORE' | 'SHOP';
    toLocationId: number;
    quantity: number;
    destinationId: number;
    createdAt: string;
    updatedAt: string;

    produitName?: string;
    fromLocationName?: string;
    toLocationName?: string;
  }
