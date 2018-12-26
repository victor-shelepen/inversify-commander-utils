import { expect } from 'chai';
import {action, controller} from "../src/decorator";
import {TActionsMetadata} from "../src/declaration";
import {getActionsMetadata, getControllerMetadata, getControllersMetadata} from "../src/lib";
import {Command} from "commander";

describe('Test', () => {

    @controller('testController')
    class TestController {

        @action('aTestAction')
        test1() {
        }
    }

    let command = new Command();

    it('Controller and action metadata  in Controller', () => {
    });
});
