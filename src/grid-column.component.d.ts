import { TemplateRef, OnInit } from '@angular/core';
export declare class GridColumnComponent implements OnInit {
    static FILTER_TYPE_SELECT: string;
    static FILTER_TYPE_INPUT: string;
    static COLUMN_TYPE_STRING: string;
    static COLUMN_TYPE_NUMBER: string;
    static DEFAULT_CSS_CLASS_VALUE: string;
    static DEFAULT_FILTERING_VALUE: boolean;
    static DEFAULT_SORTING_VALUE: boolean;
    cssClass: string;
    heading: string;
    name: string;
    filtering: boolean;
    filterType: string;
    sorting: boolean;
    width: string;
    textAlign: string;
    type: string;
    items: any;
    textField: string;
    valueField: string;
    template: TemplateRef<any>;
    ngOnInit(): void;
    resolveHeading(): string;
    resolveCell(data: any, columnName?: string): string;
}
