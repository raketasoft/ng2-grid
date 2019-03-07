import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { GridComponent } from './grid.component';
import { GridColumnComponent } from './grid-column.component';
import { GridStickyScrollComponent } from './grid-sticky-scroll.component';
import { ContextTemplateDirective } from './context-template.directive';
import { GridColumnTemplateRenderComponent } from './grid-column-template-renderer';

/**
 * Grid module class.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-beta.1
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    GridComponent,
    GridColumnComponent,
    GridStickyScrollComponent,
    GridColumnTemplateRenderComponent,
    ContextTemplateDirective
  ],
  exports: [
    GridComponent,
    GridColumnComponent,
    ContextTemplateDirective
  ]
})
export class GridModule { }
