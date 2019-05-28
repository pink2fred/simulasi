import { Directive, ElementRef, OnInit, HostListener } from "@angular/core";
import { CustomCurrencyPipe } from "./currency.pipe";

@Directive({
  selector: "[appCurrencyFormat]"
})
export class CurrencyFormatterDirective implements OnInit {
  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CustomCurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.currencyPipe.transform(this.el.value);
  }

  @HostListener("ionFocus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = this.currencyPipe.parse(value); // opossite of transform
  }
  @HostListener("ionBlur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.currencyPipe.transform(value);
  }
}
