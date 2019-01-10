export const TYPE = {
    Group: Symbol.for("Group"),
};

// @todo It is unused...
export interface IGroup {}

export interface IHandler {
    (): void;
}

export interface IGroupMetadata {
    group: string;
    target: any;
}

export type TGroupsMetadata = IGroupMetadata[];

export interface IActionMetadata {
    name: string;
    key: string;
    target: any;
}

export type TActionsMetadata = IActionMetadata[];
