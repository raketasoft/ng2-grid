import { ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { GridComponent, GridEvent, GridOptions } from '../index';
export declare class DemoComponent implements OnInit, AfterViewInit {
    private http;
    private changeDetectorRef;
    basicOptions: GridOptions;
    columnOptions: GridOptions;
    remoteDataOptions: GridOptions;
    fullConfigurationOptions: GridOptions;
    basicGrid: GridComponent;
    columnGrid: GridComponent;
    isMarriedItems: Array<any>;
    countryItems: Array<any>;
    constructor(http: Http, changeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    onItemClick(e: MouseEvent, item: any): void;
    getIsMarriedItems(): Array<any>;
    getCountryItems(): Array<any>;
    onClearSelectionBtnClick(): void;
    onGridEvent(event: GridEvent): void;
}
