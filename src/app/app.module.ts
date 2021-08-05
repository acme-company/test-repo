import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyDialogComponent } from './my-dialog/my-dialog.component';
import { MaterialModule } from './material.module';
import { SampleDialogComponent } from './sample-dialog/sample-dialog.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [				
    AppComponent,
      MyDialogComponent,
      SampleDialogComponent,
      TestComponentComponent,
      ModalComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
