import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { NoopScrollStrategy, Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
let scrollBehaviorSupported: boolean|undefined;

export function supportsScrollBehavior(): boolean {
  
  if (scrollBehaviorSupported == null) {
    // If we're not in the browser, it can't be supported. Also check for `Element`, because
    // some projects stub out the global `document` during SSR which can throw us off.
    if (typeof document !== 'object' || !document || typeof Element !== 'function' || !Element) {
      scrollBehaviorSupported = false;
      return scrollBehaviorSupported;
    }

    // If the element can have a `scrollBehavior` style, we can be sure that it's supported.
    if ('scrollBehavior' in document.documentElement!.style) {
      scrollBehaviorSupported = true;
    } else {
      // At this point we have 3 possibilities: `scrollTo` isn't supported at all, it's
      // supported but it doesn't handle scroll behavior, or it has been polyfilled.
      const scrollToFunction: Function|undefined = Element.prototype.scrollTo;

      if (scrollToFunction) {
        // We can detect if the function has been polyfilled by calling `toString` on it. Native
        // functions are obfuscated using `[native code]`, whereas if it was overwritten we'd get
        // the actual function source. Via https://davidwalsh.name/detect-native-function. Consider
        // polyfilled functions as supporting scroll behavior.
        scrollBehaviorSupported = !/\{\s*\[native code\]\s*\}/.test(scrollToFunction.toString());
      } else {
        scrollBehaviorSupported = false;
      }
    }
  }

  return scrollBehaviorSupported;
}


const _scrollBehaviorSupported = supportsScrollBehavior();

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  _previousHTMLStyles = {top: '', left: ''};
  _previousScrollPosition: {top: number, left: number} = { top: 0, left: 0 }
  _document: Document = document
  constructor(private dialog: MatDialog, private element: ElementRef, private overlay: Overlay) {
  }

  ngOnInit() {
    this._document = document;
  }
  onOpenDialog() {
    //this.dialog.open(MyDialogComponent) 
    const root = this._document.documentElement;
    const dialogRef = this.dialog.open(MyDialogComponent, { scrollStrategy: new NoopScrollStrategy() }) 

    const documentElement = document.documentElement;
    const documentRect = documentElement.getBoundingClientRect();

    const top = -documentRect.top || document.body.scrollTop || window.scrollY ||
                 documentElement.scrollTop || 0;

    const left = -documentRect.left || document.body.scrollLeft || window.scrollX ||
                  documentElement.scrollLeft || 0;

    this._previousScrollPosition = { top, left }

    // Cache the previous inline styles in case the user had set them.
    this._previousHTMLStyles.left = root.style.left || '';
    this._previousHTMLStyles.top = root.style.top || '';

        // Note: we're using the `html` node, instead of the `body`, because the `body` may
    // have the user agent margin, whereas the `html` is guaranteed not to have one.
    root.style.left = coerceCssPixelValue(-this._previousScrollPosition.left);
    root.style.top = coerceCssPixelValue(-this._previousScrollPosition.top);
    root.classList.add('global-scrollblock');

    dialogRef.afterClosed().subscribe(t => {
      root.classList.remove('cdk-global-scrollblock');
      const html = document.documentElement;
      const body = document.body;
      const htmlStyle = html.style;
      const bodyStyle = body.style;
      const previousHtmlScrollBehavior = htmlStyle.scrollBehavior || '';
      const previousBodyScrollBehavior = bodyStyle.scrollBehavior || '';

      htmlStyle.left = this._previousHTMLStyles.left;
      htmlStyle.top = this._previousHTMLStyles.top;
      html.classList.remove('global-scrollblock');
      if (_scrollBehaviorSupported) {
        htmlStyle.scrollBehavior = bodyStyle.scrollBehavior = 'auto';
      }

      window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);

      if (_scrollBehaviorSupported) {
        htmlStyle.scrollBehavior = previousHtmlScrollBehavior;
        bodyStyle.scrollBehavior = previousBodyScrollBehavior;
      }
    })
    
    // const overlayRef = this.overlay.create();
    // const userProfilePortal = new ComponentPortal(MyDialogComponent);
    // overlayRef.attach(userProfilePortal);
  }
}

function coerceCssPixelValue(value: any): string {
  if (value == null) {
    return '';
  }

  return typeof value === 'string' ? value : `${value}px`;
}

