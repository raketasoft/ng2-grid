import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, Renderer2, NO_ERRORS_SCHEMA, QueryList } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { GridComponent } from './grid.component';
import { GridOptions } from './grid-options';
import { GridColumnComponent } from './grid-column.component';

describe('GridComponent test', () => {
  let grid: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridComponent,
      ],
      providers: [
        HttpClient,
        HttpHandler,
        ChangeDetectorRef,
        Renderer2,
        QueryList
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture =  TestBed.createComponent(GridComponent);
    grid = fixture.componentInstance;
  });

  it('when pageByPage is off should filter data by regexp reserved values', () => {
    grid.options = new GridOptions({
      pageByPage: false,
    });
    const matchId = 1;
    grid.setData([{id: matchId, telephone: '+780'}, {id: 2, 'telephone': '+40'}, {id: 3, 'telephone': '85'}]);
    grid.setFilter('telephone', '+78');
    grid.render();

    const filterResults: any[] = grid.getResults();
    expect(filterResults.length).toBe(1);
      expect(filterResults[0].id).toBe(matchId);
  });

  it('isResultsDisplayAllowed with requireFilters should return true for filter and column set up', () => {
    grid.options = new GridOptions({
      requireFilters: true,
    });
    const column = new GridColumnComponent();
    column.name = 'columnName';
    column.ngOnInit();
    const columns: Array<GridColumnComponent> = [column];
    const columnList: QueryList<GridColumnComponent> = new QueryList();
    spyOn(columnList, 'toArray').and.returnValue(columns);
    grid.columnList = columnList;

    grid.ngAfterContentInit();
    grid.setFilter('columnName', 'word');

    expect(grid.isResultsDisplayAllowed()).toBe(true);
  })
});
