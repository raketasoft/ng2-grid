import { Attribute, Directive, Inject, TemplateRef } from '@angular/core';

/**
 * Custom context template directive.
 *
 * Defines a context property to templates
 */
@Directive({
    selector: 'ng-template[context]'
})
export class ContextTemplateDirective {
    constructor(
        @Attribute('context') public context: any,
        @Inject(TemplateRef) public templateRef: TemplateRef<any>
    ) {}
}
