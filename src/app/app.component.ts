import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account } from '../APIs/account';
import { environment } from '@Env';
import { DestroySubscription } from '@Base/directives';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent extends DestroySubscription implements OnInit, OnDestroy {
  production = environment.ProductionName;
  module: string;
  account;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.account = Account;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
