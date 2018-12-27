import { expect } from 'chai';
import {action, controller} from "../src/decorator";
import {IController, TActionsMetadata, TYPE} from "../src/declaration";
import {
    build, create,
    getActionsPrototypeMetadata,
    getControllerPrototypeMetadata,
    getControllersMetadata,
    registerControllers
} from "../src/lib";
import {Command} from "commander";
import * as commander from 'commander';
import {Container} from "inversify";

describe('Test', () => {

    let strResult = '';

    @controller('testController')
    class TestController implements IController {

        @action('aTestAction')
        testA() {
            strResult = 'testController:aTestAction'
        }

        @action('bTestAction')
        testB() {
            strResult = 'testController:bTestAction'
        }
    }
    let _commander = new Command();

    it('Controller and action metadata  in Controller', () => {
        const container = new Container();
        registerControllers(container);
        const controllers = container.getAll<IController>(TYPE.Controller);
        expect(controllers.length).above(0);
        expect(true).eq(true);
        build(_commander, container)
    });

    it('Build', () => {
        _commander.parse(['node', 'file.js', 'testController:aTestAction']);
        expect(strResult).eq('testController:aTestAction');
    });

    it('Create', () => {
        create();
        commander.parse(['node', 'file.js', 'testController:bTestAction']);
        expect(strResult).eq('testController:bTestAction');
    });

});
