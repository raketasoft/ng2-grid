import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  ViewChild,
  OnInit
} from '@angular/core';

@Component({
  selector: 'ng-grid-sticky-scroll',
  template: `
      <div class="sticky-scroll" #stickyScroll>
          <div class="horizontal-scrollbar">
              <div
                      #areaCopy
                      class="horizontal-scrollbar-copy">
              </div>
          </div>
      </div>`
})
export class GridStickyScrollComponent implements OnInit {
  @Input() scrollableElement: ElementRef;
  @ViewChild('stickyScroll') scrollContainer: ElementRef;
  @ViewChild('areaCopy') areaCopy: ElementRef;

  private tableScrollListener: any;
  private stickyScrollListener: any;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.tableScrollListener = this.attachScrollListener(
      this.scrollableElement.nativeElement.parentElement,
      this.onTableScroll
    );
    this.stickyScrollListener = this.attachScrollListener(
      this.areaCopy.nativeElement.parentElement,
      this.onScroll
    );
  }

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

  attachScrollListener(element: any, callback: any): void {
    return this.renderer.listen(
      element,
      'scroll',
      callback.bind(this)
    );
  }

  /**
   * Synchronizes sticky scrollbar when grid scrollbar is moved
   *
   * @param event
   */
  onTableScroll(event: Event): void {
    const scrollableElementWidth: number = this.scrollableElement.nativeElement.scrollWidth;
    const stickyScrollWidth: number = this.areaCopy.nativeElement.scrollWidth;
    const scrollRatio: number = (stickyScrollWidth / scrollableElementWidth);
    this.stickyScrollListener();
    this.areaCopy.nativeElement.parentElement.scrollLeft = Number(event.srcElement.scrollLeft * scrollRatio).toFixed();
    this.stickyScrollListener = this.attachScrollListener(
      this.areaCopy.nativeElement.parentElement,
      this.onScroll
    );
  }

  /**
   * Handles onScroll event of the sticky scrollbar and modified scrollable
   * element scrollLeft property
   *
   * @param {Event} event
   */
  onScroll(event: Event): void {
    const scrollableElementWidth: number = this.scrollableElement.nativeElement.scrollWidth;
    const stickyScrollWidth: number = this.areaCopy.nativeElement.scrollWidth;
    const scrollRatio: number = scrollableElementWidth / stickyScrollWidth;
    this.tableScrollListener();
    this.scrollableElement.nativeElement.parentElement.scrollLeft = Number(event.srcElement.scrollLeft * scrollRatio).toFixed();
    this.tableScrollListener = this.attachScrollListener(
      this.scrollableElement.nativeElement.parentElement,
      this.onTableScroll
    );
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
