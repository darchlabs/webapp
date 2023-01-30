export type Node = {
    id: string;
    name: string;
    chain: string;
    port: string;
    fromBlockNumber: number;
    status: string;
};

type _nodeFormData = {
    network: string;
    fromBlockNumber: number;
};

export type NodeBase = {
    network: string;
    fromBlockNumber: number;
};

export type NodeFormData = _nodeFormData & {};