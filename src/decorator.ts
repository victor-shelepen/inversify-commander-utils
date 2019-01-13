import { inject, injectable, decorate } from "inversify";
import {METADATA_KEY} from "./constant";
import {IActionMetadata, IGroupMetadata, IHandler, IOption, TActionsMetadata, TGroupsMetadata} from "./declaration";

export function group(name= "default") {
    return function (target: any) {
        let currentMetadata: IGroupMetadata = {
            name,
            target
        };
        decorate(injectable(), target);
        Reflect.defineMetadata(METADATA_KEY.group, currentMetadata, target);

        // We need to create an array that contains the metadata of all
        // the groups in the application, the metadata cannot be
        // attached to a group. It needs to be attached to a global
        // We attach metadata to the Reflect object itself to avoid
        // declaring additonal globals. Also, the Reflect is avaiable
        // in both node and web browsers.
        const previousMetadata: TGroupsMetadata = Reflect.getMetadata(
            METADATA_KEY.group,
            Reflect
        ) || [];

        const newMetadata = [currentMetadata, ...previousMetadata];

        Reflect.defineMetadata(
            METADATA_KEY.group,
            newMetadata,
            Reflect
        );
    };
}

export function action(name: string, options: IOption[] = []) {
    return function (target: any, key: string, value: any) {

        let metadata: IActionMetadata = {
            key,
            name,
            target,
            options
        };

        let metadataList: TActionsMetadata = [];

        if (!Reflect.hasMetadata(METADATA_KEY.action, target.constructor)) {
            Reflect.defineMetadata(METADATA_KEY.action, metadataList, target.constructor);
        } else {
            metadataList = Reflect.getMetadata(METADATA_KEY.action, target.constructor);
        }

        metadataList.push(metadata);
    };
}
