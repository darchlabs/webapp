export type Node = {
    id: string;
    chain: string;
    port: string;
    status: string;
};

type _nodeFormData = {
    network: string;
    fromBlockNumber: number;
};

export type NodeFormData = _nodeFormData & {};