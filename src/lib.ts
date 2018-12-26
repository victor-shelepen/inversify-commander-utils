import {IControllerMetadata, TActionsMetadata, TControllersMetadata, TYPE} from "./declaration";
import {METADATA_KEY} from "./constant";
import * as commander  from 'commander';
import {Command} from  'commander';
import {Container} from "inversify";

export function getControllersMetadata(): TControllersMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.controller,
        Reflect
    );
}

export function getControllerMetadata(controller: any): IControllerMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.controller,
        controller
    );
}

export function getActionsMetadata(controller: any): TActionsMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.action,
        controller
    );
}

export function create(): Container {
    const container = new Container();

    return container;
}

export function registerControllers(container: Container) {
    const controllersMetadata = getControllersMetadata();
    controllersMetadata.forEach((controllerMetadata) => {
        const constructor = controllerMetadata.target;
        const name = constructor.name;
        if (container.isBoundNamed(TYPE.Controller, name)) {
            throw new Error(DUPLICATED_CONTROLLER_NAME(name));
        }
        container.bind(TYPE.Controller)
            .to(constructor)
            .whenTargetNamed(name);
    });
}

export function build(commander: Command, container: Container) {
    // const controllersMetadata = getControllersMetadata();
    // controllersMetadata.forEach((controllerMetadata) => {
    //    const actionsMetadata = getActionsMetadata(controllerMetadata.target);
    //    actionsMetadata.forEach((actionMetadata) => {
    //        commander
    //            .name(actionMetadata.name)
    //            .action(() => {
    //
    //            })
    //    });
    //
    //
    // });
}

export const DUPLICATED_CONTROLLER_NAME = (name: string) =>
    `Two controllers cannot have the same name: ${name}`;