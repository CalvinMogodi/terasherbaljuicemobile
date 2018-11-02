import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import {CardpaymentPage} from '../cardpayment/cardpayment'
//declare var Stripe;
//declare var TCO;
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html',
})
export class CartPage {
    //stripe = Stripe('pk_test_veYkJjz0E8rmtTE3VItKfUZP');
    //tco = TCO.loadPubKey('sandbox');
    showDeliveryMethodError = false;
    showPaymentMethodError = false;
    card: any;
    checkoutCard =
        {
            sellerId: '#203740556',
            publishableKey: "B4CF6C85-9675-42DB-9B2A-FF8A1C37A46F",
            ccNo: '',
            cvv: '',
            expMonth: '',
            expYear: ''
        };

    deliveryMethods =
        [
            "Collect at the shop",
            "Deliver to address"

        ];

    paymentMethods =
        [
            "Cash Deposit",
            "EFT",
            "Card"
        ];

    public order = {
        createdDate: null,
        deliveryMethod: '',
        deliveryAddress: '',
        paymentMethod: '',
        quantity: 1,
        status: 'Pending Payment',
        userId: '',
        monthId: new Date().getMonth() + 1,
        uploadedPOP: false,
        user: '',
        reference: '',
        orderNumber: 0,
        waybillNumber: 0,
        cost: '',
        audit: {
            pendingPaymentDone: false,
            pendingPaymentDate: '',
            awaitingApprovalDone: false,
            awaitingApprovalDate: '',
            readyForDeliveryDone: false,
            readyForDeliveryDate: '',
            collectedByCourierDone: false,
            collectedByCourierDate: '',
        }
    }

    public cardDetails =
        {
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
            quantity: 0
        };

    public database: any;
    public showSpinner: any;
    public showAddress = false;
    public showPaymentForm = false;
    public priceTotal = '0';
    public data: any
    public userId: any;
    public user: any;
    public unitsBoughtThisMonth = 0;
    public price: 0;

    constructor(private inAppBrowser: InAppBrowser,public db: AngularFireDatabase, private storage: Storage, public navCtrl: NavController, public navParams: NavParams, public http: Http, public userService: UserserviceProvider, public toast: ToastController) {

        this.order.userId = navParams.get('userData5');
        this.userId = navParams.get('userData5');
        this.price = navParams.get('price');
        this.database = db.database;
        this.priceTotal = (1 * this.price).toFixed(2);
        /* var today = new Date();
         var dd = today.getDate();
         var mm = today.getMonth() + 1; //January is 0!
         var yyyy = today.getFullYear();
         var date = dd + '-' + mm + '-' + yyyy;
 
         //this.order.createdDate = date;
 
         var startSearchString = '1-';
         startSearchString = startSearchString + today.getMonth() + 1 + '-';
         startSearchString = startSearchString + today.getFullYear();
 
         var endSearchString = "31-";
         endSearchString = endSearchString + today.getMonth() + 1 + '-';
         endSearchString = endSearchString + today.getFullYear();
 
         this.database.ref().child('orders').orderByChild('monthId')
             .equalTo(today.getMonth() + 1).once('value', (snapshot) => {
                 snapshot.forEach(snap => {
                     var order = snap.val()
                     order.createdDate = this.timeConverter(order.createdDate);
                     let date = new Date(this.timeConverter(order.createdDate));
                     let monthId = date.getMonth;
                     if (order.userId == this.userId
                         && order.createdDate.substring(4, order.createdDate.length - 1)) {
                         this.unitsBoughtThisMonth += Number(order.quantity);
                     }
                 });
 
                 if (this.unitsBoughtThisMonth >= 5)
                     this.paymentMethods.push("Points");
             });*/

        this.db.database.ref().child('users/' + this.userId).once('value', (snapshot) => {
            this.user = snapshot.val();
        });

        //get orders placed this month
        /*this.database.ref('orders').orderByChild('createdDate')
                     .startAt(startSearchString).endAt(endSearchString)
                     .once('value', (snapshot)=>
                     {
                        snapshot.forEach(snap =>
                        {
                            var test = snap.val()
                            //this.unitsBoughtThisMonth += snap.val().quantity;
                        });
                    });*/
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CartPage');
        //this.setupStripe();
    }

    timeConverter(timestamp) {
        var a = new Date(timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + '-' + month + '-' + year;
        return time;
    }

    toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    requestToken() {
        /*var args = {
        sellerId: "203740556",
        publishableKey: "B4CF6C85-9675-42DB-9B2A-FF8A1C37A46F",
        ccNo: $("#ccNo").val(),
        cvv: $("#cvv").val(),
        expMonth: $("#expMonth").val(),
        expYear: $("#expYear").val()
      };*/

        // this.tco.requestToken()
    }

    success(data) {

    }

    failure(error) {

    }

    checkoutSetup() {
        var form = document.getElementById('myCCForm');
        form.addEventListener('submit', event => {
            event.preventDefault();

            this.checkoutCard =
                {
                    sellerId: '901381908',
                    publishableKey: "B4CF6C85-9675-42DB-9B2A-FF8A1C37A46F",
                    ccNo: '4790125006250469',
                    cvv: '099',
                    expMonth: '11',
                    expYear: '20'
                };
        });
    }

    setupStripe() {
        //let elements = this.stripe.elements();
        var style = {
            base: {
                color: '#32325d',
                lineHeight: '24px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        //this.card = elements.create('card', { style: style });
        //this.card.mount("#card-element");

      
        var form = document.getElementById('payment-form');
        form.addEventListener('submit', event => {
            event.preventDefault();

            var text = "";
            var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
            var len = 5;

            for (var i = 0; i < len; i++)
                text += charset.charAt(Math.floor(Math.random() * charset.length));
            this.order.reference = text;
            var newOrder = this.database.ref('orders').push();
            newOrder.set(this.order, done => {
                this.database.ref().child('users/' + this.userId).once('value', (snapshot) => {
                    this.user = snapshot.val();

                    this.user.points = this.user.points + (30 * this.order.quantity);
                    this.database.ref().child('users/' + this.userId)
                        .update(this.user);

                });

                let toast = this.toast.create({
                    message: 'Order placed successfuly',
                    duration: 3000,
                    position: 'top'
                });

                toast.onDidDismiss(() => {
                    this.navCtrl.setRoot(HomePage, { userData: this.order.userId })
                });
                toast.present();
            });
        });
    }

    dismiss() {
        this.navCtrl.setRoot(HomePage, { userData: this.order.userId })
    }

    checkValue(deliveryMethod) {
        if (deliveryMethod == "Deliver to address")
            this.showAddress = true;
        else
            this.showAddress = false;

    }

    calculateTotal(quantity) {
        this.priceTotal = (quantity * this.price).toFixed(2);
    }

    pay() {
        //var test = this.cardDetails;

        //place order in db
        //generate reference
        var text = "";
        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        var len = 7;

        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));

        this.order.reference = text;
        this.order.cost = this.priceTotal;
        this.order.audit.pendingPaymentDone = true;
        this.order.audit.pendingPaymentDate = this.timeConverter(this.dateToTimestamp(new Date().toString()));
        var newOrder = this.database.ref('orders').push();
        this.order.user = this.user.name + " " + this.user.surname;
        this.order.reference = text;
        this.order.createdDate = this.toTimestamp(new Date().toString());
        let orderCountRef = this.db.database.ref('staticData/orderCount');
        orderCountRef.orderByValue().once("value", total => {
            let newTotal = Number(total.val()) + 1;
            this.order.orderNumber = newTotal;
            var timestamp = this.dateToTimestamp(new Date().toString());
            this.order.createdDate = timestamp;
            newOrder.set(this.order, done => {
                let url = "http://teraspayment.epizy.com/index.php?payGateID=" + 1025357100018 + "&amount=" + this.priceTotal + "&email=" + this.user.email + "&reference=" + this.order.reference;
                const optionss: InAppBrowserOptions = {
                    zoom: 'no',
                    location:'yes',
                    toolbar:'yes',
                    clearcache: 'yes',
                    clearsessioncache: 'yes',
                    disallowoverscroll: 'yes',
                    enableViewportScale: 'yes'
                } 
                const browser = this.inAppBrowser.create(url, '_self', optionss); 
                browser.show();
            });
        });
    }

    dateToTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    updateOrderCount(total) {
        var updates = {};
        updates['staticData/orderCount/'] = total;
        this.db.database.ref().update(updates);
    }


    placeOrder() {
       
        this.showDeliveryMethodError = false;
        this.showPaymentMethodError = false;
        if (this.order.paymentMethod == "") {
            this.showPaymentMethodError = true;
            return;
        }

        if (this.order.deliveryMethod == "") {
            this.showDeliveryMethodError = true;
            return;
        }
        this.showSpinner = true;
        this.storage.set("id4", this.order);
        if (this.order.paymentMethod != 'Card') {
            //generate reference
            var text = "";
            var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
            var len = 5;

            for (var i = 0; i < len; i++)
                text += charset.charAt(Math.floor(Math.random() * charset.length));

            this.order.reference = text;

            var newOrder = this.database.ref('orders').push();
            this.order.user = this.user.name + " " + this.user.surname;
            this.order.reference = text;
            this.order.cost = this.priceTotal;
            var timestamp = this.dateToTimestamp(new Date().toString());
            this.order.createdDate = timestamp;
            let orderCountRef = this.db.database.ref('staticData/orderCount');
            orderCountRef.orderByValue().once("value", total => {
                let newTotal = Number(total.val()) + 1;
                this.order.orderNumber = newTotal;
                newOrder.set(this.order, done => {
                    //send sms with reference
                    this.updateOrderCount(this.order.orderNumber);
                    var headers = new Headers();
                    headers.append("Accept", 'application/json');
                    headers.append('Content-Type', 'application/x-www-form-urlencoded');
                    let options = new RequestOptions({ headers: headers });

                    var notification =
                        JSON.stringify({
                            number: this.user.cellPhone,
                            reference: this.order.reference
                        });

                    this.http.post('http://terasherbaljuice.dedicated.co.za/api/sms/send', notification, options)
                        .subscribe(data => {
                            var breakeHere = "";
                        });
                    //update points
                    this.database.ref().child('users/' + this.userId).once('value', (snapshot) => {
                        this.user = snapshot.val();

                        this.user.points = this.user.points + (10 * this.order.quantity);
                        this.database.ref().child('users/' + this.userId)
                            .update(this.user);

                    });

                    let toast = this.toast.create({
                        message: 'Order placed successfuly',
                        duration: 3000,
                        position: 'top'
                    });

                    toast.onDidDismiss(() => {
                        this.navCtrl.setRoot(HomePage, { userData: this.order.userId })
                    });

                    toast.present();

                });
            });

        }
        else if (this.order.paymentMethod == 'Card') {
           this.pay();              
        }
        /* else if (this.order.paymentMethod == 'Points') {
 
             this.database.ref().child('users/' + this.userId)
                 .once('value', (snapshot) => {
                     var userToProcess = snapshot.val();
                     if (userToProcess.points >= this.price * Number(this.order.quantity)) {
                         var text = "";
                         var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
                         var len = 5;
 
                         for (var i = 0; i < len; i++)
                             text += charset.charAt(Math.floor(Math.random() * charset.length));
 
                         this.order.reference = text;
                         //proceed with payment
                         var newOrder = this.database.ref('orders').push();
                         let orderCountRef = firebase.database().ref('staticData/orderCount');
                         orderCountRef.orderByValue().once("value", total => {
                             let newTotal = Number(total.val()) + 1;
                             this.order.orderNumber = newTotal;
                               var timestamp = this.dateToTimestamp(new Date().toString());
             this.order.createdDate = timestamp;
                             newOrder.set(this.order, done => {
                                 //update count
                                 this.updateOrderCount(this.order.orderNumber);
                                 //update points
                                 this.database.ref().child('users/' + this.userId).once('value', (snapshot) => {
                                     this.user = snapshot.val();
 
                                     this.user.points = this.user.points - this.price * Number(this.order.quantity);
                                     this.database.ref().child('users/' + this.userId)
                                         .update(this.user);
 
                                 });
 
                                 let toast = this.toast.create({
                                     message: 'Order placed successfuly',
                                     duration: 3000,
                                     position: 'top'
                                 });
 
                                 toast.onDidDismiss(() => {
                                     this.navCtrl.setRoot(HomePage, { userData: this.order.userId })
                                 });
 
                                 toast.present();
                             });
 
                         })
                     }
                     else {
                         //not enough points
                         let toast = this.toast.create({
                             message: 'You do not haven enough points.\n\
                                         Please select a different method.',
                             duration: 3000,
                             position: 'top'
                         });
 
                         toast.onDidDismiss(() => {
                             this.showSpinner = false;
                         });
 
                         toast.present();
 
                     }
                 });
 
         }*/

    }

}
