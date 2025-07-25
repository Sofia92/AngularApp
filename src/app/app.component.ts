import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@Env';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {
  production = environment.ProductionName;
  module: string;
  account;

  constructor() {
  }

  ngOnInit(): void {
    this.account = 'Account';
  }

  ngOnDestroy(): void {
  }
}
