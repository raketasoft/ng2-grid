import { NgModule } from '@angular/core';

import { GridComponent } from './grid.component';
import { GridColumnComponent } from './grid-column.component';
import { GridCellRendererComponent } from './grid-cell-renderer.component';
import { GridDataProvider } from './grid-data-provider';
import { GridEvent } from './grid-event';
import { GridOptions } from './grid-options';

@NgModule({
  declarations: [
    GridComponent,
    GridColumnComponent,
    GridCellRendererComponent,
    GridDataProvider,
    GridEvent,
    GridOptions
  ],
  exports: [
    GridComponent,
    GridColumnComponent,
    GridDataProvider,
    GridEvent,
    GridOptions
  ]
})
export class GridModule { }
