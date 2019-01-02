import {IController, IControllerMetadata, TActionsMetadata, TControllersMetadata, TYPE} from "./declaration";
import {METADATA_KEY} from "./constant";
import * as commander  from "commander";
import {Command} from  "commander";
import {Container} from "inversify";

export function getControllersMetadata(): TControllersMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.controller,
        Reflect
    );
}

export function getControllerPrototypeMetadata(controller: IController): IControllerMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.controller,
        controller
    );
}

export function getActionsPrototypeMetadata(controller: IController): TActionsMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.action,
        controller
    );
}

export function getControllerMetadata(instance: IController): IControllerMetadata {
    return getControllerPrototypeMetadata(instance.constructor);
}

export function getActionsMetadata(controller: IController): TActionsMetadata {
    return getActionsPrototypeMetadata(controller.constructor);
}


export function create(): Container {
    const container = new Container();
    registerControllers(container);
    build(commander, container);

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

export function build(_commander: Command, container: Container) {
    const controllers = container.getAll<IController>(TYPE.Controller);
    controllers.forEach((controllerContainer) => {
        const controllerMetadata = getControllerMetadata(controllerContainer);
        const actionsMetadata = getActionsMetadata(controllerContainer);
        actionsMetadata.forEach((actionMetadata) => {
            const name = controllerMetadata.group + (controllerMetadata.group ? ":" : "") + actionMetadata.name;
            const command = _commander.command(name);
            command
                .action((...args) => {
                    controllerContainer[actionMetadata.key](...args);
                });
        });
    });
}

export function cleanUpMetadata() {
    Reflect.defineMetadata(
        METADATA_KEY.controller,
        [],
        Reflect
    );
}

export const DUPLICATED_CONTROLLER_NAME = (name: string) =>
    `Two controllers cannot have the same name: ${name}`;
