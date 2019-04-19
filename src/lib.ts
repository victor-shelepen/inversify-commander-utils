import {IGroup, IGroupMetadata, IOption, TActionsMetadata, TGroupsMetadata, TYPE} from "./declaration";
import {METADATA_KEY} from "./constant";
import * as commander  from "commander";
import {Command} from  "commander";
import {Container} from "inversify";
import {parseARGV} from "./commander";

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
            throw new Error(DUPLICATED_GROUP_NAME(name));
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
            if (actionMetadata.description) {
                commander.description(actionMetadata.description);
            }
            if (actionMetadata.options) {
                actionMetadata.options.forEach((option: IOption) => {
                    command
                        .option(option.pattern, option.description, option.validator);
                });
            }
            command
                .action(async (...args) => {
                    await groupContainer[actionMetadata.key](...args);
                });
        });
    });
}

export async function processARGV(argv: string[], container: Container) {
    const commandData = parseARGV(argv);
    const groups = container.getAll<IGroup>(TYPE.Group);
    let groupContainer;
    let groupMetadata;
    let actionMetadata;
    top:
        for (const _groupContainer of groups) {
            const _groupMetadata = getGroupMetadata(_groupContainer);
            const _actionsMetadata = getActionsMetadata(_groupContainer);
            for (const _actionMetadata of _actionsMetadata) {
                const fullCommandName = _groupMetadata.name + (_groupMetadata.name ? ":" : "") + _actionMetadata.name;
                if (fullCommandName === commandData.name) {
                    groupContainer = _groupContainer;
                    groupMetadata = _groupMetadata;
                    actionMetadata = _actionMetadata;
                    break top;
                }
            }
        }
    if (!groupContainer || !groupMetadata || !actionMetadata) {
        throw new Error("All parts were not fetch for future successful command procession");
    }
    const result = await groupContainer[actionMetadata.key](commandData);

    return result;
}

export function cleanUpMetadata() {
    Reflect.defineMetadata(
        METADATA_KEY.group,
        [],
        Reflect
    );
}

export const DUPLICATED_GROUP_NAME = (name: string) =>
    `Two groups cannot have the same name: ${name}`;
