import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppInitService } from './app-init.service';

registerLocaleData(zh);

function initializeFactory(ssoService: AppInitService): () => void {
  return () => ssoService.appInit();
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [AppInitService],
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


