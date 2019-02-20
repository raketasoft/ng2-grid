import {
    Component,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
    ViewChild
} from '@angular/core';

@Component({
 selector: 'ng-grid-sticky-scroll',
 template: `<div class="sticky-scroll" #stickyScroll>
     <div class="horizontal-scrollbar" (scroll)="onScroll($event)">
         <div
                 #areaCopy
                 class="horizontal-scrollbar-copy">
         </div>
     </div>
 </div>`
})
export class GridStickyScrollComponent {
    @Input() scrollableElement: ElementRef;
    @ViewChild('stickyScroll') scrollContainer: ElementRef;
    @ViewChild('areaCopy') areaCopy: ElementRef;

    constructor(private renderer: Renderer2) { }

    /**
     * Handle window scroll event.
     */
    @HostListener('window:scroll', ['$event'])
    protected onWindowScroll(event: UIEvent) {
        const documentTopOffset: number = document.documentElement.scrollTop;
        const scrollableElementTopOffset: number = this.scrollableElement.nativeElement.parentElement.offsetTop;
        const scrollableElementWidth: number = this.scrollableElement.nativeElement.scrollWidth;
        const clientWidth: number = this.scrollableElement.nativeElement.parentElement.clientWidth;

        if (scrollableElementTopOffset - documentTopOffset <= 0 && scrollableElementWidth > clientWidth) {
            this.areaCopy.nativeElement.style.width = this.calculateStickyScrollWidth() + 'px';
            this.renderer.addClass(
                this.scrollContainer.nativeElement,
                'sticky-scrollbar-visible'
            );
        } else {
            this.renderer.removeClass(
                this.scrollContainer.nativeElement,
                'sticky-scrollbar-visible'
            );
        }
    }

    /**
     * Handles onScroll event of the sticky scrollbar and modified scrollable
     * element scrollLeft property
     *
     * @param {UiEvent} event
     */
    onScroll(event: UIEvent): void {
        const scrollableElementWidth: number = this.scrollableElement.nativeElement.scrollWidth;
        const stickyScrollWidth: number = this.areaCopy.nativeElement.scrollWidth;
        const scrollRatio: number = scrollableElementWidth / stickyScrollWidth;
        this.scrollableElement.nativeElement.parentElement.scrollLeft = (event.target.scrollLeft * scrollRatio);
    }

    /**
     * Calculates the width of the sticky scrollbar copy element
     *
     * @returns {number}
     */
    private calculateStickyScrollWidth(): number {
        const scrollWidth: number = this.scrollableElement.nativeElement.scrollWidth;
        const clientWidth: number = this.scrollableElement.nativeElement.parentElement.clientWidth;
        const stickyScrollbarWidth: number = this.scrollContainer.nativeElement.clientWidth;
        const scrollRatio: number = scrollWidth / clientWidth;

        return (stickyScrollbarWidth * scrollRatio);
    }
}
