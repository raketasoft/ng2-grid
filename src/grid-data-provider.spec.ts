import { Http, HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { map, shuffle } from 'lodash';

import { GridDataProvider } from './grid-data-provider';

/**
 * @param {GridDataProvider} provider
 * @param {Array<any>} expectedSortedData
 * @param {string} key
 * @param {string} sortType
 * @param {boolean} caseInsensitiveSort
 */
function shuffleSortAndAssert(
    provider: GridDataProvider,
    expectedSortedData: Array<any>,
    key: string,
    sortType: string,
    caseInsensitiveSort = false
) {
    provider.sourceData = shuffle(expectedSortedData);
    provider.setSort(key, sortType, caseInsensitiveSort);
    provider.getData();

    const actualColumn: Array<any> = map(provider.sourceData, key);
    const expectedColumn: Array<any> = map(provider.sourceData, key);

    expect(actualColumn).toEqual(expectedColumn);
}

describe('GridDataProvider test', () => {
    let provider: GridDataProvider;

     beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ]
        });

        provider = new GridDataProvider(TestBed.get(Http));
    });

    it('should be sorted by level1.level2.level3 desc', () => {
        const expectedSortedData: any = [
            {
                'level1': {
                    'level2': {
                        'level3': 'LEVEL 2',
                    }
                }
            },
            {
                'level1': {
                    'level2': {
                        'level3': 'LEVEL 1',
                    }
                }
            },
            {
                'level1': null
            }
        ];

        shuffleSortAndAssert(provider, expectedSortedData, 'level1.level2.level3', 'desc');
    });

    it('should be sorted by level1.level2.level3 asc', () => {
        const expectedSortedData: any = [
            {
                'level1': null
            },
            {
                'level1': {
                    'level2': {
                        'level3': 'LEVEL 1',
                    }
                }
            },
            {
                'level1': {
                    'level2': {
                        'level3': 'LEVEL 2',
                    }
                }
            }
        ];

        shuffleSortAndAssert(provider, expectedSortedData, 'level1.level2.level3', 'asc');
    });

    it('should be sorted by name asc', () => {
        const expectedSortedData: any = [
            {
                'name': null
            },
            {
                'name': 'a',
            },
            {
                'name': 'b'
            }
        ];

        shuffleSortAndAssert(provider, expectedSortedData, 'name', 'asc');
    });

    it('should be sorted by name desc', () => {
        const expectedSortedData: any = [
            {
                'name': 'b'
            },
            {
                'name': 'a',
            },
            {
                'name': null
            }
        ];

        shuffleSortAndAssert(provider, expectedSortedData, 'name', 'desc');
    });

    it('should be sorted by name asc insensitive', () => {
        const expectedSortedData: any = [
            {
                'name': null
            },
            {
                'name': 'a',
            },
            {
                'name': 'B'
            }
        ];

        shuffleSortAndAssert(provider, expectedSortedData, 'name', 'asc', true);
    });

    it('should be sorted by name desc insensitive', () => {
        const expectedSortedData: any = [
            {
                'name': 'B'
            },
            {
                'name': 'a',
            },
            {
                'name': null
            }
        ];

        shuffleSortAndAssert(provider, expectedSortedData, 'name', 'desc', true);
    });

});
