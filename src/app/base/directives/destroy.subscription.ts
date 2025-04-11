import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// tslint:disable-next-line:directive-class-suffix
@Directive({
  standalone: true
})
export abstract class DestroySubscription implements OnDestroy {
  protected destroy$: Subject<unknown> = new Subject();

  public ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
