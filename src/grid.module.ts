import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { GridComponent } from './grid.component';
import { GridColumnComponent } from './grid-column.component';
import { GridCellRendererComponent } from './grid-cell-renderer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule
  ],
  exports: [
    GridComponent,
    GridColumnComponent,
    GridCellRendererComponent
  ],
  declarations: [
    GridComponent,
    GridColumnComponent,
    GridCellRendererComponent
  ],
  providers: [],
})
export class GridModule { }

