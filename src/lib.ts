import {IGroup, IGroupMetadata, IOption, TActionsMetadata, TGroupsMetadata, TYPE} from "./declaration";
import {METADATA_KEY} from "./constant";
import * as commander  from "commander";
import {Command} from  "commander";
import {Container} from "inversify";

export function getGroupsMetadata(): TGroupsMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.group,
        Reflect
    );
}

export function getGroupPrototypeMetadata(group: IGroup): IGroupMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.group,
        group
    );
}

export function getActionsPrototypeMetadata(group: IGroup): TActionsMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.action,
        group
    );
}

export function getGroupMetadata(instance: IGroup): IGroupMetadata {
    return getGroupPrototypeMetadata(instance.constructor);
}

export function getActionsMetadata(group: IGroup): TActionsMetadata {
    return getActionsPrototypeMetadata(group.constructor);
}


export function create(): Container {
    const container = new Container();
    registerGroups(container);
    build(commander, container);

    return container;
}

export function registerGroups(container: Container) {
    const groupsMetadata = getGroupsMetadata();
    groupsMetadata.forEach((groupMetadata) => {
        const constructor = groupMetadata.target;
        const name = constructor.name;
        if (container.isBoundNamed(TYPE.Group, name)) {
            throw new Error(DUPLICATED_CONTROLLER_NAME(name));
        }
        container.bind(TYPE.Group)
            .to(constructor)
            .whenTargetNamed(name);
    });
}

export function build(programm: Command, container: Container) {
    const groups = container.getAll<IGroup>(TYPE.Group);
    groups.forEach((groupContainer) => {
        const groupMetadata = getGroupMetadata(groupContainer);
        const actionsMetadata = getActionsMetadata(groupContainer);
        actionsMetadata.forEach((actionMetadata) => {
            const name = groupMetadata.name + (groupMetadata.name ? ":" : "") + actionMetadata.name;
            const command = programm.command(name);
            if (actionMetadata.options) {
                actionMetadata.options.forEach((option: IOption) => {
                    command
                        .option(option.pattern, option.description, option.validator);
                });
            }
            command
                .action((...args) => {
                    groupContainer[actionMetadata.key](...args);
                });
        });
    });
}

export function cleanUpMetadata() {
    Reflect.defineMetadata(
        METADATA_KEY.group,
        [],
        Reflect
    );
}

export const DUPLICATED_CONTROLLER_NAME = (name: string) =>
    `Two groups cannot have the same name: ${name}`;
