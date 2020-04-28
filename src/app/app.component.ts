import { Component, ViewChild, OnInit, NgZone } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import * as uuid from "uuid";
import { ConsoleReporter } from "jasmine";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  data = "";
  url = "";
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  fileList = [];
  isCustomer = false;
  turnOnSection = "";

  private signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: screen.width / 2,
    canvasHeight: screen.height / 2
  };
  constructor(private socket: Socket, private _ngZone: NgZone) {
    this.socket.on("getData", data => {
      //console.log("DATA" + data);
      this.signaturePad.clear();
      this.signaturePad.fromDataURL(data);
    });

    this.socket.on("DocUploaded", data => {
      this.fileList.push(data);
    });
    this.socket.on("controlTo", data => {
      console.log(data);
      this.turnOnSection = data;
    });
  }
  clear() {
    this.signaturePad.clear();
  }

  ngOnInit() {
    this.join();
  }

  updateSection() {
    const s = document.querySelector('input[name="section"]:checked').value;

    //const s = document.getElementsByName("section"); //.filter(c => c.checked);
    this.socket.emit("controlFrom", s);
  }

  join() {
    const roomid = window.location.hash;
    this.url = roomid.replace("&customer=1", "");
    this.socket.emit("join", roomid.replace("&customer=1", ""));
    this.isCustomer = roomid.includes("customer=1");
    //var ss = require("socket.io-stream");
  }

  uploadDoc() {
    const file = document.getElementById("fileupload");
    //console.log(file.files);
    this.socket.emit("uploadDoc", file.files);
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    const data = this.signaturePad.toDataURL();
    this.socket.emit("sendData", data);
    //console.log(data);
  }

  create() {
    const id = uuid.v4();
    window.document.location.href = "#" + id; // + "&customer=1";
    window.document.location.reload();
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    //console.log('begin drawing');
  }
}
