import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';

/**
 * Generated class for the JuicehomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-juicehome',
  templateUrl: 'juicehome.html',
})
export class JuicehomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  placeAnOrder(){
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JuicehomePage');
  }

}
