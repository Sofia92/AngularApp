import { pick } from 'lodash';

export class Account {
  static id;
  static code;
  static userName;
  static orgName;
  static orgId: any;
  static accessToken;
  static isAdmin = false;
  static isAuthorizationInstructor = false;
  static userComputerInfo = { ipAddress: null };

  public static init(attr): void {
    Account.id = attr.id;
    Account.code = attr.code;
    Account.userName = attr.name;
    Account.orgName = attr.orgName;
    Account.orgId = attr.orgId;
    Account.isAdmin = attr.admin;
    Account.accessToken = attr.accessToken;
    Account.isAuthorizationInstructor = !!attr.zdysCode;
    Account.userComputerInfo.ipAddress = attr.userComputerInfo?.ipAddress;
    this._store();
  }

  public static destroy(): void {
    Account.id = null;
    Account.code = null;
    Account.userName = null;
    Account.orgName = null;
    Account.orgId = null;
    Account.isAdmin = false;
    Account.accessToken = null;
    Account.isAuthorizationInstructor = false;
    Account.userComputerInfo = { ipAddress: null };
    
    localStorage.removeItem('currentUser');
  }

  public static setAdmin(isAdmin: boolean) {
    Account.isAdmin = isAdmin;
    this._store();
  }

  private static _store() {
    localStorage.setItem('currentUser', JSON.stringify(pick(Account, [
      'id',
      'code',
      'userName',
      'orgName',
      'orgId',
      'isAdmin',
      'accessToken',
      'staffType',
      'isAuthorizationInstructor',
      'userComputerInfo'
    ])));
  }
}
