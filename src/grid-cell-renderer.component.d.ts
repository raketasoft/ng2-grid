import { ViewContainerRef, OnInit } from '@angular/core';
import { GridColumnComponent } from './grid-column.component';
export declare class GridCellRendererComponent implements OnInit {
    private viewContainerRef;
    data: any;
    column: GridColumnComponent;
    constructor(viewContainerRef: ViewContainerRef);
    ngOnInit(): void;
}
