import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { SignaturePadModule } from "angular2-signaturepad";
import { AppComponent } from "./app.component";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
const config: SocketIoConfig = {
  url: "https://lrp1b.sse.codesandbox.io",
  options: {}
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SocketIoModule.forRoot(config), SignaturePadModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
