import { expect } from 'chai';
import {parseARGV, parseArgumentStr} from '../src/commander';

describe('Commander processor', () => {
  it('test', () => {
    expect('test').equal('test');
  });

  describe('Parse parameter string', () => {
    it('--useExtra', () => {
      const parameter = parseArgumentStr('--useExtra');
      expect(parameter.key).equal('useExtra');
      expect(!!parameter.value).equal(true);
    });

    it('--format=A4', () => {
      const parameter = parseArgumentStr('--format=A4');
      expect(parameter.key).equal('format');
      expect(parameter.value).equal('A4');
    });
  });

  it('parse', () => {
    const argv = [
      'ts-node',
      'console.ts',
      '--format=A4',
      'print'
    ];
    const commandData = parseARGV(argv);
    expect(commandData.runner).equal('ts-node');
    expect(commandData.script).equal('console.ts');
    expect(commandData.name).equal('print');
    expect(commandData.arguments[0].key).equal('format');
    expect(commandData.arguments[0].value).equal('A4');
  });
});