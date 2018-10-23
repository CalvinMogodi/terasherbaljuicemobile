import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the CardpaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cardpayment',
  templateUrl: 'cardpayment.html',
})
export class CardpaymentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private iab: InAppBrowser) {
    /*const browser = this.iab.create('https://secure.paygate.co.za/payweb3/process.trans');

browser.on('loadstop').subscribe(event => {
   browser.insertCSS({ code: "body{color: red;" });
});

browser.close();*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardpaymentPage');
  }

  

}
