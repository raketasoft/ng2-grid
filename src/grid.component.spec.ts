import {ComponentFixture, TestBed} from '@angular/core/testing';

import { GridComponent } from './grid.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ChangeDetectorRef, Renderer2, NO_ERRORS_SCHEMA } from '@angular/core';
import { GridOptions } from './grid-options';

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
    })
});
