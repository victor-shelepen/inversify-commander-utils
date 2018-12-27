export const TYPE = {
    Controller: Symbol.for("Controller"),
};

// @todo It is unused...
export interface IController {}

export interface IHandler {
    (): void;
}

export interface IControllerMetadata {
    group: string;
    target: any;
}

export type TControllersMetadata = IControllerMetadata[];

export interface IActionMetadata {
    name: string;
    key: string;
    target: any;
}

export type TActionsMetadata = IActionMetadata[];
