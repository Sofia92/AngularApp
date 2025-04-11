/**
 * 监测元素是否进入视图区域
 *  <p *ngIf="pagination.index<pagination.max" VisibleObserver (visible)="loadMore()"></p>
 */
import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[VisibleObserver]',
})
export class VisibleObserverDirective implements AfterViewInit, OnDestroy {
    public observer;
    @Output() public visible = new EventEmitter();

    constructor(private _elf: ElementRef) {
        const callback = (entries) => {
            entries.forEach(({ intersectionRatio }) => {
                if (intersectionRatio <= 0) return;
                this.visible.emit()
            });
        };

        this.observer = new IntersectionObserver(callback);
    }

    public ngAfterViewInit(): void {
        this.observer.observe(this._elf.nativeElement);
    }

    public ngOnDestroy(): void {
        this.observer.unobserve(this._elf.nativeElement);
    }

}