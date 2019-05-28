import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  Component,
  ViewContainerRef
} from "@angular/core";

@Directive({
  selector: "[appNextFocus]"
})
export class NextFocusDirective {
  private el: ElementRef;

  constructor(private _el: ElementRef) {
    this.el = _el;
  }

  @HostListener("keydown", ["$event"]) onKeyDown(e: any) {
    if (e.which == "13" || e.keyCode == 13) {
      e.preventDefault();
      let ti =
        "ion-input[tabindex='" + (+this.el.nativeElement.tabIndex + 1) + "']";
      let control: any;
      control = document.querySelector(ti);
      if (control) {
        control.setFocus();
        // control.select();
      }
    }
  }
}
