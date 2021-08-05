import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from './my-dialog/my-dialog.component';
import { NoopScrollStrategy, Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
  }
  onClick() {
    const iframe = document.createElement('iframe')
    iframe.src = 'http://localhost:4200/applications/products/EGY_EVISA'
    iframe.classList.add('visible')
    document.body.append(iframe)
  }
}


