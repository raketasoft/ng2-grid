import {
  Component,
  ComponentFactory,
  ComponentResolver,
  ViewContainerRef,
  ReflectiveInjector,
  Injector,
  Input,
  OnInit
} from '@angular/core';
import * as _ from 'lodash';

/**
 * GridCell component used to render grid cell template.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.4
 */
@Component({
  selector: 'ng-grid-cell',
  template: ''
})
export class GridCell implements OnInit {
  @Input() data: any;
  @Input() directives: Array<any>;
  @Input() template: string;

  /**
   * Class constructor.
   *
   * @param {ComponentResolver} resolver
   * @param {ViewContainerRef} viewContainerRef
   * @param {Injector} injector
   */
  constructor(
    private resolver: ComponentResolver,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector) {
  }

  /**
   * Handle OnInit event.
   * GridCellRenderer component is created with given template and directives
   * and attached to the cell.
   */
  ngOnInit() {
    let component: any = this.toComponent(
      this.renderTemplate(this.template),
      this.directives
    );

    this.resolver
      .resolveComponent(component)
      .then(
        (factory: ComponentFactory<any>) => {
          let injector: Injector = ReflectiveInjector.fromResolvedProviders(
            [],
            this.viewContainerRef.parentInjector
          );
          this.viewContainerRef.createComponent(factory, 0, injector, []);
        },
        (reason: any) => {
          this.viewContainerRef.remove(0);
        }
      );
  }

  private toComponent(template: string = '', directives: Array<any> = []): any {
    @Component({
      selector: 'ng-grid-cell-renderer',
      template: template,
      directives: directives
    })
    class GridCellRenderer {}

    return GridCellRenderer;
  }

  /**
   * Render template by replacing data params with actual values.
   *
   * @param {string} template
   * @returns {string}
   */
  renderTemplate(template: string): string {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    let compiled: _.TemplateExecutor = _.template(template);

    return compiled(this.data);
  }
}
