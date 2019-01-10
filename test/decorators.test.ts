import { expect } from 'chai';
import {action, group} from "../src/decorator";
import {
    cleanUpMetadata,
    getActionsMetadata,
    getActionsPrototypeMetadata, getGroupMetadata,
    getGroupPrototypeMetadata,
    getGroupsMetadata
} from "../src/lib";

describe('Decorators', () => {
    let groupInstance!: any;
    let TestGroup!: any;

    before(() => {
        cleanUpMetadata();

        @group('test')
        class _TestGroup {

            @action('test1')
            test1() {
            }

            @action('test2')
            test2() {
            }
        }

        TestGroup = _TestGroup
        groupInstance = new TestGroup();
    });

    it('Group and action metadata  in Group', () => {
        const groupsMetadata = getGroupsMetadata();
        const groupMetadataA = groupsMetadata.find((o) => o.group === 'test');
        expect(groupMetadataA!.group).eq('test');

        let groupMetadataB = getGroupPrototypeMetadata(TestGroup);
        expect(groupMetadataB.group).eq('test');
        expect(groupMetadataB.group).eq(groupMetadataA!.group);

        let actionsMetadata = getActionsPrototypeMetadata(TestGroup);
        let test2MetaData = actionsMetadata.find((o) => o.name === 'test2');
        expect(test2MetaData!.key).eq('test2');

        // Instance.
        groupMetadataB = getGroupMetadata(groupInstance);
        expect(groupMetadataB.group).eq('test');
        expect(groupMetadataB.group).eq(groupMetadataA!.group);

        actionsMetadata = getActionsMetadata(groupInstance);
        test2MetaData = actionsMetadata.find((o) => o.name === 'test2');
        expect(test2MetaData!.key).eq('test2');
    });
});
