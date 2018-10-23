import { Component, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { NavController,MenuController, NavParams, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { OrderhistoryPage } from '../orderhistory/orderhistory';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { Storage } from '@ionic/storage';
import { CardpaymentPage } from '../cardpayment/cardpayment';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { OrderPage } from '../order/order';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {
    uid: any;
    public numOfPendingPaymentOrders;
    public numOfAwiatingApprovelOrders;
    public user: any;
    public points: any;
    public usersUnderMe = [];
    public loading = true;
    public loadingOrders = true;
    public loadingPoints = true;
    public myCommision;
    constructor(public db: AngularFireDatabase ,private menuCtrl: MenuController, public userService: UserserviceProvider, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public events: Events) {
         this.menuCtrl.enable(true);
        this.uid = navParams.get('userData');
        this.events.publish("gotId", this.uid);
        //this.uid = this.userService.getUid();

        //get user
        this.db.database.ref().child('users/' + this.uid).once('value', (snapshot) => {
            this.user = snapshot.val();
            if (this.user != undefined || this.user != null) {
                if (this.user.points != undefined || this.user.points != null)
                    this.points = this.user.points;
            } else {
                this.points = 0;
            }
            this.loadingPoints = false;
        });

        //get number of orders placed
        this.db.database.ref().child('orders').orderByChild('userId').equalTo(this.uid).on('value', (snapshot) => {
            this.numOfPendingPaymentOrders = 0;
            this.numOfAwiatingApprovelOrders = 0;
            var test = snapshot.val();
            if (test != null) {
                this.storage.set("id2", test);
                snapshot.forEach(snap => {
                    let order = snap.val();
                    if (order.status == 'Awaiting Approval' || order.status == 'Awaiting Final Approval') {
                        this.numOfAwiatingApprovelOrders = this.numOfAwiatingApprovelOrders + 1;
                    }
                    if (order.status == 'Pending Payment') {
                        this.numOfPendingPaymentOrders = this.numOfPendingPaymentOrders + 1;
                    }
                });
            }
            else {
                this.numOfPendingPaymentOrders = 0;
                this.numOfAwiatingApprovelOrders = 0;
            }
            this.loadingOrders = false;
        });

        //get people under user
        var refForUsers = this.db.database.ref();
        this.myCommision = 0;
        refForUsers.child('users').orderByChild('referredBy').equalTo(this.uid).on('value', (snapshot) => {
            var test = snapshot.val();
            this.usersUnderMe = [];
            if (test != null) {
                this.storage.set("id2", test);
                
                snapshot.forEach(snap => {
                    let user = snap.val();
                    if(user.isActive){
                        if(!user.referrerIsPaid)
                            this.myCommision += 200;
                    }
                    this.usersUnderMe.push(user);
                    
                });
                this.myCommision = this.myCommision.toFixed(2);
                this.loading = false;
            }
            else {
                this.loading = false;
            }

        });

    }

    ionViewDidEnter() {
        // If you have more than one side menu, use the id like below
        // this.menu.swipeEnable(false, 'menu1');
    }

    public placeAnOrder() {
        this.navCtrl.push(OrderPage, {
            userData2: this.uid
        });
        // this.navCtrl.push(CardpaymentPage);
    }

    public viewOrders(status) {
        this.navCtrl.push(OrderhistoryPage, {
            userData2: this.uid,
            status: status,
        });
    }

    logout(){
        this.db.database.app.auth().signOut();
        this.navCtrl.setRoot(LoginPage, {
          userData: null
      });
    }
}
