import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Account } from "../APIs/account";
import { AccountDTO } from "@Api";

@Injectable()
export class AppInitService {

  constructor(private _router: Router) {
  }

  public async appInit() {
    if (location.href.includes('/external/')) {
      this._initToken();
      return Promise.resolve(true);
    }
    const ssoAddress = window['SSO__Authority'];
    const initResponse = ssoAddress && !!ssoAddress.trim()
      ? await this.ssoInitHandle(ssoAddress)
      : await this.jwtInitHandle();

    return initResponse;
  }

  public logout(): void {
    this.clearStorage();
    sessionStorage.clear();
    console.log('logout')
  }

  // SSO 方式登录
  private async ssoInitHandle(ssoAddress: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  // JWT 方式登录
  private jwtInitHandle() {
    return new Promise((resolve) => {
      if (!!Account?.id || localStorage.getItem('currentUser')) {
        if (!Account?.id) {
          const store = localStorage.getItem('currentUser') as string;
          const account = JSON.parse(store);
          Account.init(account);
        }
        resolve(true);
      } else {
        this._router.navigate(['/login']);
        resolve(true);
      }
    })
  }


  private storeAccount(account: AccountDTO) {
    Account.init(account);
  }

  private clearStorage() {
    const stableCacheKeys = ["-sds-app-theme-colors", `jzcache:${Account.id}`];
    Object.keys(localStorage)
      .filter(key => !stableCacheKeys.includes(key))
      .forEach(key => localStorage.removeItem(key));
    Account.destroy();
  }

  private _initToken() {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('signatureToken')) {
      localStorage.setItem('signatureToken', queryParams.get('signatureToken'));
    }
  }
}
