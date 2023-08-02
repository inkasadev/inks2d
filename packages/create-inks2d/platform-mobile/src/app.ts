import { KeepAwake } from "@capacitor-community/keep-awake";
import { App } from "@capacitor/app";

KeepAwake.keepAwake();
window.screen.orientation.lock("portrait");

App.addListener("backButton", () => {
  App.exitApp();
});
