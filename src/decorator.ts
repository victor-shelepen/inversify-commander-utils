import { inject, injectable, decorate } from "inversify";
import {METADATA_KEY} from "./constant";
import {IActionMetadata, IControllerMetadata, IHandler, TActionsMetadata, TControllersMetadata} from "./declaration";

export function controller(group= "default") {
    return function (target: any) {
        let currentMetadata: IControllerMetadata = {
            group,
            target
        };
        decorate(injectable(), target);
        Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);

        // We need to create an array that contains the metadata of all
        // the controllers in the application, the metadata cannot be
        // attached to a controller. It needs to be attached to a global
        // We attach metadata to the Reflect object itself to avoid
        // declaring additonal globals. Also, the Reflect is avaiable
        // in both node and web browsers.
        const previousMetadata: TControllersMetadata = Reflect.getMetadata(
            METADATA_KEY.controller,
            Reflect
        ) || [];

        const newMetadata = [currentMetadata, ...previousMetadata];

        Reflect.defineMetadata(
            METADATA_KEY.controller,
            newMetadata,
            Reflect
        );
    };
}

export function action(name: string) {
    return function (target: any, key: string, value: any) {

        let metadata: IActionMetadata = {
            key,
            name,
            target
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
