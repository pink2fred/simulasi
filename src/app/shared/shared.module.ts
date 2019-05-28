import { Keyboard } from "@ionic-native/keyboard/ngx";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomCurrencyPipe } from "./currency.pipe";
import { CurrencyFormatterDirective } from "./currency-formatter.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { File } from "@ionic-native/file/ngx";
import { NextFocusDirective } from "./next-focus.directive";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    CurrencyFormatterDirective,
    CustomCurrencyPipe,
    ReactiveFormsModule,
    NextFocusDirective
  ],
  declarations: [
    CurrencyFormatterDirective,
    CustomCurrencyPipe,
    NextFocusDirective
  ],
  providers: [CustomCurrencyPipe, SocialSharing, File, Keyboard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
