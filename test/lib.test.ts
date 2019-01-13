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
    let cmd = '';
    let options: any = {};

    before(() => {
        cleanUpMetadata();

        @group('testGroup')
        class TestGroup implements IGroup {

            @action('aTestAction')
            testA() {
                strResult = 'testGroup:aTestAction';
            }

            @action(
                'bTestAction <cmd>',
                [
                    { pattern: '-e, --exec_mode <mode>', description: 'Which exec mode to use' }
                ]
            )
            testB(_cmd: string, _options: any) {
                strResult = 'testGroup:bTestAction';
                cmd = _cmd;
                options = _options;
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
        _commander.parse(['node', 'file.js', 'testGroup:aTestAction', 'someCmd']);
        expect(strResult).eq('testGroup:aTestAction');
    });

    it('Create, command and options', () => {
        create();
        commander.parse(['node', 'file.js', 'testGroup:bTestAction', 'cmd', '--exec_mode', 'testing']);
        expect(strResult).eq('testGroup:bTestAction');
        expect(options.exec_mode).eq('testing');
    });

});
