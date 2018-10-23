import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  public uid: any;
  public database: any;
  public loading = true;
  public loadingPrice = true;
  public loadingStock = true;
  public price = 0;

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public storage: Storage) {
    this.uid = navParams.get('userData2');

    this.database = this.db.database;
    let priceRef = this.db.database.ref('staticData/saPrice');
    priceRef.orderByValue().on("value", juicePrice => {
      var price = juicePrice.val();
      if(price == null || price == undefined)
        this.price = 0;
        else
        this.price = price;
      
      this.loadingPrice = false;
      if(!this.loadingStock)
        this.loading = false;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }
 

  goToCart() {
    // this.storage.set("id7", this.uid);
    let modal = this.modalCtrl.create(CartPage,
      {
        userData5: this.uid,
        price: this.price, 
      });
    modal.present();
  }

}
