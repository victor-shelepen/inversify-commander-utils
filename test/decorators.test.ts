import { expect } from 'chai';
import {action, controller} from "../src/decorator";
import {TActionsMetadata} from "../src/declaration";
import {getActionsMetadata, getControllerMetadata, getControllersMetadata} from "../src/lib";

describe('Test', () => {

    @controller('test')
    class TestController {

        @action('test1')
        test1() {
        }

        @action('test2')
        test2() {
        }
    }

    it('Controller and action metadata  in Controller', () => {
        const controllersMetadata = getControllersMetadata();
        const controllerMetadataA = controllersMetadata.find((o) => o.group === 'test');
        expect(controllerMetadataA!.group).eq('test');

        const controllerMetadataB = getControllerMetadata(TestController);
        expect(controllerMetadataB.group).eq('test');
        expect(controllerMetadataB.group).eq(controllerMetadataA!.group);

        const actionsMetadata: TActionsMetadata = getActionsMetadata(TestController)
        const test2MetaData = actionsMetadata.find((o) => o.name === 'test2');
        expect(test2MetaData!.key).eq('test2');
    });
});
