import {
  Component,
  ViewContainerRef,
  Input,
  OnInit, TemplateRef
} from '@angular/core';
import { GridColumnComponent } from './grid-column.component';

/**
 * GridColumnTemplateRenderComponent component used to render Grid column templates.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.4
 */
@Component({
  selector: 'ng-grid-column-template-renderer',
  template: ''
})
export class GridColumnTemplateRenderComponent implements OnInit {
  @Input() data: any;
  @Input() column: GridColumnComponent;
  @Input() template: TemplateRef<any>;

  /**
   * Class constructor.
   *
   * @param {ViewContainerRef} viewContainerRef
   */
  constructor(private viewContainerRef: ViewContainerRef) {}

  /**
   * Handle onInit event.
   */
  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template, {
      'column': this.column,
      'data': this.data
    });
  }
}
