import { expect } from 'chai';
import {action, group} from "../src/decorator";
import {IGroup, TYPE} from "../src/declaration";
import {
    build, cleanUpMetadata, create,
    registerGroups
} from "../src/lib";
import {Command} from "commander";
import * as commander from 'commander';
import {Container} from "inversify";

describe('Lib', () => {
    let strResult = '';

    before(() => {
        cleanUpMetadata();

        @group('testGroup')
        class TestGroup implements IGroup {

            @action('aTestAction')
            testA() {
                strResult = 'testGroup:aTestAction'
            }

            @action('bTestAction')
            testB() {
                strResult = 'testGroup:bTestAction'
            }
        }
    });
    let _commander = new Command();

    it('Group and action metadata  in Group', () => {
        const container = new Container();
        registerGroups(container);
        const groups = container.getAll<IGroup>(TYPE.Group);
        expect(groups.length).above(0);
        expect(true).eq(true);
        build(_commander, container)
    });

    it('Build', () => {
        _commander.parse(['node', 'file.js', 'testGroup:aTestAction']);
        expect(strResult).eq('testGroup:aTestAction');
    });

    it('Create', () => {
        create();
        commander.parse(['node', 'file.js', 'testGroup:bTestAction']);
        expect(strResult).eq('testGroup:bTestAction');
    });

});
