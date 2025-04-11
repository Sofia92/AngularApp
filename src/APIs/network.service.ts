import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponseBase } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Account } from '@account';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  public file: any;
  public files: any;

  constructor(private http: HttpClient) {
  }

  public get signatureToken(): string | null {
    return Account?.accessToken || localStorage.getItem('signatureToken');
    // return localStorage.getItem('signatureToken');
  }

  public getApiUrl(url: string): string {
    const localUrlPrefixs = ['/api'];
    if (url.includes('http') || localUrlPrefixs.some(prefix => url.includes(prefix))) {
      return encodeURI(url);
    }
    const host = url.includes('http') ? url : environment.WebApiAddress;
    return encodeURI(`${host}${url}`);
  }

  public request(
    method: string,
    url: string,
    options: IHttpRequestOptions = {},
    resOptions: IHttpResponseHandle = {}
  ): Observable<any> {
    const { defaultValue, pick } = resOptions;
    const hasCustomResponse = 'defaultValue' in resOptions;

    options.headers = this.prepareHeaders(options?.headers);
    return this.http.request(method, this.getApiUrl(url), options)
      .pipe(
        catchError((error: HttpResponseBase) => {
          if (error.status === 401) {
            console.error('Error', '未授权，准备重新登录');
            // this.login();
            return;
          }
          if (hasCustomResponse) {
            // this._nzNotification.error('Error', '未授权，准备重新登录');
            return of(defaultValue);
          } else {
            throwError(error);
            return of(error);
          }
        })
      );
  }

  public get(url: string, params: any = {}, options: { headers?: any } = {}): Observable<any> {
    return this.request('GET', url, { params, ...options });
  }

  public post(url: string, body: any = {}, options: { headers?: any, params?: any, responseType?: string } = {}): Observable<any> {
    return this.request('POST', url, { body, ...options });
  }

  public put(url: string, body: any = {}): Observable<any> {
    return this.request('PUT', url, { body });
  }

  public delete(url: string, params: any = {}): Observable<any> {
    return this.request('DELETE', url, { params });
  }

  public patch(url: string, body: any): Observable<any> {
    return this.request('PATCH', url, { body });
  }

  public head(url: string): Observable<any> {
    return this.request('HEAD', url);
  }

  public options(url: string): Observable<any> {
    return this.request('OPTIONS', url);
  }


  public getWithResHandle(url: string, params: any = {}, resOptions: IHttpResponseHandle = {}): Observable<any> {
    return this.request('GET', url, { params }, resOptions);
  }

  public postWithResHandle(url: string, body: any = {}, resOptions: IHttpResponseHandle = {}): Observable<any> {
    return this.request('POST', url, { body }, resOptions);
  }

  public deleteWithResHandle(url: string, params: any = {}, resOptions: IHttpResponseHandle = {}): Observable<any> {
    return this.request('DELETE', url, { params }, resOptions);
  }

  private prepareHeaders(customHeaders: any): HttpHeaders {
    const headers = { 'Content-Type': 'application/json', ...customHeaders };
    if (this.signatureToken) {
      const authorization = `Bearer ${this.signatureToken}`;
      Object.assign(headers, { ['Authorization']: authorization });
    }
    return new HttpHeaders(headers);
  }

}

export interface IHttpRequestOptions { body?: any, params?: any, headers?: any, [key: string]: any }
export interface IHttpResponseHandle { defaultValue?: any, pick?: string }