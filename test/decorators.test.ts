import { expect } from 'chai';
import {action, controller} from "../src/decorator";
import {
    cleanUpMetadata,
    getActionsMetadata,
    getActionsPrototypeMetadata, getControllerMetadata,
    getControllerPrototypeMetadata,
    getControllersMetadata
} from "../src/lib";

describe('Decorators', () => {
    let controllerInstance!: any;
    let TestController!: any;

    before(() => {
        cleanUpMetadata();

        @controller('test')
        class _TestController {

            @action('test1')
            test1() {
            }

            @action('test2')
            test2() {
            }
        }

        TestController = _TestController
        controllerInstance = new TestController();
    });

    it('Controller and action metadata  in Controller', () => {
        const controllersMetadata = getControllersMetadata();
        const controllerMetadataA = controllersMetadata.find((o) => o.group === 'test');
        expect(controllerMetadataA!.group).eq('test');

        let controllerMetadataB = getControllerPrototypeMetadata(TestController);
        expect(controllerMetadataB.group).eq('test');
        expect(controllerMetadataB.group).eq(controllerMetadataA!.group);

        let actionsMetadata = getActionsPrototypeMetadata(TestController);
        let test2MetaData = actionsMetadata.find((o) => o.name === 'test2');
        expect(test2MetaData!.key).eq('test2');

        // Instance.
        controllerMetadataB = getControllerMetadata(controllerInstance);
        expect(controllerMetadataB.group).eq('test');
        expect(controllerMetadataB.group).eq(controllerMetadataA!.group);

        actionsMetadata = getActionsMetadata(controllerInstance);
        test2MetaData = actionsMetadata.find((o) => o.name === 'test2');
        expect(test2MetaData!.key).eq('test2');
    });
});
