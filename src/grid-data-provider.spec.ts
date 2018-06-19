import {Http, HttpModule} from '@angular/http';
import {TestBed} from '@angular/core/testing';
import {get} from 'lodash';

import {gridDataStub} from './grid-data-privder.stub';
import {GridDataProvider} from './grid-data-provider';

describe('GridDataProvider test', () => {
    let provider: GridDataProvider;

     beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ]
        });

        provider = new GridDataProvider(TestBed.get(Http), {sourceData: gridDataStub});
    });

    it('should be sorted by id desc', () => {
        provider.setSort('id', 'desc');
        provider.getData();
        const actualSortedData: any = provider.sourceData;

        expect(actualSortedData[0].id).toEqual(8633);
        expect(actualSortedData[1].id).toEqual(7856);
        expect(actualSortedData[2].id).toEqual(7855);
        expect(actualSortedData[3].id).toEqual(7854);
        expect(actualSortedData[4].id).toEqual(6121);
        expect(actualSortedData[5].id).toEqual(5700);
        expect(actualSortedData[6].id).toEqual(5699);
        expect(actualSortedData[7].id).toEqual(5118);
        expect(actualSortedData[8].id).toEqual(5117);
        expect(actualSortedData[9].id).toEqual(5116);
    });

    it('should be sorted by id asc', () => {
        provider.setSort('id', 'asc');
        provider.getData();
        const actualSortedData: any = provider.sourceData;

        expect(actualSortedData[0].id).toEqual(5116);
        expect(actualSortedData[1].id).toEqual(5117);
        expect(actualSortedData[2].id).toEqual(5118);
        expect(actualSortedData[3].id).toEqual(5699);
        expect(actualSortedData[4].id).toEqual(5700);
        expect(actualSortedData[5].id).toEqual(6121);
        expect(actualSortedData[6].id).toEqual(7854);
        expect(actualSortedData[7].id).toEqual(7855);
        expect(actualSortedData[8].id).toEqual(7856);
        expect(actualSortedData[9].id).toEqual(8633);
    });

    it('should be sorted by investmentSizeSetLevel.investmentSizeLevel.defaultName desc', () => {
        provider.setSort('investmentSizeSetLevel.investmentSizeLevel.defaultName', 'desc');
        provider.getData();
        const actualSortedData: any = provider.sourceData;

        expect(get(actualSortedData, '0.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toEqual('LEVEL 3');
        expect(get(actualSortedData, '1.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toEqual('LEVEL 2');
        expect(get(actualSortedData, '2.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toEqual('LEVEL 1');
        expect(get(actualSortedData, '3.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '4.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '5.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '6.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '7.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '8.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '9.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
    });

    it('should be sorted by investmentSizeSetLevel.investmentSizeLevel.defaultName asc', () => {
        provider.setSort('investmentSizeSetLevel.investmentSizeLevel.defaultName', 'asc');
        provider.getData();
        const actualSortedData: any = provider.sourceData;

        expect(get(actualSortedData, '0.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '1.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '2.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '3.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '4.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '5.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '6.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toBeUndefined();
        expect(get(actualSortedData, '7.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toEqual('LEVEL 1');
        expect(get(actualSortedData, '8.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toEqual('LEVEL 2');
        expect(get(actualSortedData, '9.investmentSizeSetLevel.investmentSizeLevel.defaultName')).toEqual('LEVEL 3');
    });


    it('should be sorted by description asc', () => {
        provider.setSort('description', 'asc');
        provider.getData();
        const actualSortedData: any = provider.sourceData;

        expect(actualSortedData[0].description).toBeNull();
        expect(actualSortedData[1].description).toBeNull();
        expect(actualSortedData[2].description).toBeNull();
        expect(actualSortedData[3].description).toBeNull();
        expect(actualSortedData[4].description).toBeNull();
        expect(actualSortedData[5].description).toBeNull();
        expect(actualSortedData[6].description).toEqual('d');
        expect(actualSortedData[7].description).toEqual('f');
        expect(actualSortedData[8].description).toEqual('s');
        expect(actualSortedData[9].description).toEqual('z');
    });

    it('should be sorted by description desc', () => {
        provider.setSort('description', 'desc');
        provider.getData();
        const actualSortedData: any = provider.sourceData;

        expect(actualSortedData[0].description).toEqual('z');
        expect(actualSortedData[1].description).toEqual('s');
        expect(actualSortedData[2].description).toEqual('f');
        expect(actualSortedData[3].description).toEqual('d');
        expect(actualSortedData[4].description).toBeNull();
        expect(actualSortedData[5].description).toBeNull();
        expect(actualSortedData[6].description).toBeNull();
        expect(actualSortedData[7].description).toBeNull();
        expect(actualSortedData[8].description).toBeNull();
        expect(actualSortedData[9].description).toBeNull();
    });

    it('should be sorted by name asc insensitive', () => {
        provider.setSort('name', 'asc', true);
        provider.getData();
        const actualSortedData: any = provider.sourceData;

        expect(actualSortedData[0].name).toBeNull();
        expect(actualSortedData[1].name).toBeNull();
        expect(actualSortedData[2].name).toBeNull();
        expect(actualSortedData[3].name).toBeNull();
        expect(actualSortedData[4].name).toBeNull();
        expect(actualSortedData[5].name).toBeNull();
        expect(actualSortedData[6].name.toLowerCase()).toEqual('b');
        expect(actualSortedData[7].name.toLowerCase()).toEqual('g');
        expect(actualSortedData[8].name.toLowerCase()).toEqual('g');
        expect(actualSortedData[9].name.toLowerCase()).toEqual('x');
    });

    it('should be sorted by name desc insensitive', () => {
        provider.setSort('name', 'desc', true);
        provider.getData();
        const actualSortedData: any = provider.sourceData;

        expect(actualSortedData[0].name.toLowerCase()).toEqual('x');
        expect(actualSortedData[1].name.toLowerCase()).toEqual('g');
        expect(actualSortedData[2].name.toLowerCase()).toEqual('g');
        expect(actualSortedData[3].name.toLowerCase()).toEqual('b');
        expect(actualSortedData[4].name).toBeNull();
        expect(actualSortedData[5].name).toBeNull();
        expect(actualSortedData[6].name).toBeNull();
        expect(actualSortedData[7].name).toBeNull();
        expect(actualSortedData[8].name).toBeNull();
        expect(actualSortedData[9].name).toBeNull();
    });
});
