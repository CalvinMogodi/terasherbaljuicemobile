import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { OrderdetailsPage } from '../orderdetails/orderdetails';

/**
 * Generated class for the OrderhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orderhistory',
  templateUrl: 'orderhistory.html',
})
export class OrderhistoryPage {
  public uid: any;
  public database: any;
  public historicOrders = [];
  public orders: Observable<any[]>;
  public loading = true;
  public title = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public db: AngularFireDatabase) {
     //this.orders = afDatabase.list('/orders');
    // this.orders = db.list('orders').valueChanges();
    this.uid = navParams.get('userData2');
    this.title = navParams.get('status');
   // this.database = firebase.database();
    //var refForHistoricData = this.database.ref();
    let status = this.title;
    if(status == 'Order History')
      status = 'Approved'    
    if(status == '')
      status = 'Awaiting Final Approval'

    db.database.ref().child('orders').orderByChild('userId').equalTo(this.uid).on('value', (snapshot)=>{
      var orders = snapshot.val();
      this.historicOrders = [];
           if(orders != null){
             snapshot.forEach(snap =>{
               var order = snap.val();
               order.key = snap.key;
               if(status === "Awaiting Approval"){
                  if(order.status == 'Awaiting Approval' || order.status == 'Awaiting Final Approval'){
                    order.dateDisplay = this.timeConverter(order.createdDate);
                    this.historicOrders.push(order);               
                  }
               }else if(status === "Pending Payment" && order.status == status){
                  order.dateDisplay = this.timeConverter(order.createdDate);
                  this.historicOrders.push(order);  
               }
               else if(status == 'Approved'){
                  if(order.status == 'Awaiting Courier Pickup' || order.status == 'With Courier'){
                    order.dateDisplay = this.timeConverter(order.createdDate);
                    this.historicOrders.push(order);
                  }
                }
              });
              this.historicOrders.sort(function (a, b) {
                  return b.orderNumber - a.orderNumber;
              })
           }
           this.loading = false;
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderhistoryPage');
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
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    viewOrderDetails(order){
      let modal = this.modalCtrl.create(OrderdetailsPage,{order: order});
      modal.present();
    }
}
