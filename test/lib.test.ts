import { expect } from 'chai';
import {action, group} from "../src/decorator";
import {IGroup, TYPE} from "../src/declaration";
import {
  build, cleanUpMetadata, create, processARGV,
  registerGroups
} from '../src/lib';
import {Command} from "commander";
import * as commander from 'commander';
import {Container} from "inversify";
import {ICommandData} from '../src/commander';

describe('Lib', () => {
    let container: Container;
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
            'bTestAction',
            [
              {pattern: '-e, --exec_mode <mode>', description: 'Which exec mode to use'}
            ]
          )
          async testB(_cmd: string, _options: any) {
            strResult = 'testGroup:bTestAction';
            cmd = _cmd;
            options = _options;
          }

          @action(
            'cAsync'
          )
          async cAsync(_cmd: string, _options: any) {
            return new Promise((resolve) => {
              setTimeout(() => {
                strResult = 'testGroup:bTestAction';
                cmd = _cmd;
                options = _options;
                resolve('cAsync');
              }, 100);
            });
          }

          @action(
            'print'
          )
          async print(commandData: ICommandData) {
            const formatArgument = commandData.arguments.find(a => a.key == 'format');
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(formatArgument!.value);
              }, 100);
            });
          }
        }
    });

    let _commander = new Command();

    it('Group and action metadata  in Group', () => {
        container = new Container();
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

    it('Build', async () => {
        create();
        commander.parse(['node', 'file.js', 'testGroup:bTestAction', 'cmd', '--exec_mode', 'testing']);
        expect(strResult).eq('testGroup:bTestAction');
        expect(options.exec_mode).eq('testing');
    });

    it('Process ARV', async () => {
        const result = await processARGV(['node', 'file.js', '--format=A4', 'testGroup:print'], container);
        expect(result).eq('A4');
    });

});
