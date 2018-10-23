import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ToastController, ViewController, LoadingController} from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';
import { Base64 } from '@ionic-native/base64';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the OrderdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orderdetails',
  templateUrl: 'orderdetails.html',
})
export class OrderdetailsPage {
public order: any;
public dateStr = '';
public storageRef: any;
  constructor(public afStorage: AngularFireStorage, public db: AngularFireDatabase, public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, private fileChooser: FileChooser, public iosFilePicker: IOSFilePicker, public toast: ToastController, private filePath: FilePath) {
    this.order = navParams.get('order');
    this.dateStr = this.timeConverter(this.order.createdDate);
    this.storageRef = afStorage.storage.ref();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderdetailsPage');
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

    openFileChooser(){
      if (this.platform.is('ios')) {
      this.pickFileFromIOSDevice();
    }
    else if (this.platform.is('android')) {
      this.pickFileFromAndroidDevice();
    }

    else if (this.platform.is('browser')) {
      this.pickFileFromAndroidDevice();
    }
  }
  
   pickFileFromIOSDevice() {
    this.iosFilePicker.pickFile().then(uri => {
        (<any>window).FilePath.resolveNativePath(uri, (result) => {
        this.readimage(result);
      });
      }).catch(error => {
        this.showError(error);
      });
  }

  getfileext(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    return file.toLowerCase();
  }

  readimage(result) {
    var type = '';    
    if (this.getfileext(result) == 'pdf') {
      var type = 'application/pdf';
    } else if (this.getfileext(result) == 'jpeg' || this.getfileext(result) == 'png' || this.getfileext(result) == 'jpg') {
      var type = 'image/jpeg';
    }
    if (type == '') { 
      this.showError('You can only upload PDF or image');    }    
    else {
     (<any>window).resolveLocalFileSystemURL(result, (res) => {
        res.file((resFile) => {
          var reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) => {
            var imgBlob = new Blob([evt.target.result], { type: type });
            this.inserUserPOPImage(imgBlob, this.order.key)
          }
        })
      })
    }
  }

  pickFileFromAndroidDevice() {
    this.fileChooser.open().then(uri => {
      (<any>window).FilePath.resolveNativePath(uri, (result) => {
        this.readimage(result);
      });
    }).catch(error => {
      this.showError(error);
    });
  }

  showError(str) {
    let toast = this.toast.create({
      message: str,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  inserUserPOPImage(file, orderId) {
     var loader = this.loadingCtrl.create({
        content: "Please wait..."
      });

      loader.present();
    this.order.uploadedPOP = true;
    this.order.audit.pendingPaymentDone = true;
    var storageRef = this.afStorage.storage.ref();
    var imageRef = this.storageRef.child('proofOfPayment/' + orderId);
    imageRef.put(file).then(snapshot => {
      this.showError('Proof of payment is saved successful.');
      this.updateUser();
         loader.dismiss();
    });
  }

  updateUser(){
    var updates = {};
    var date = this.timeConverter(this.dateToTimestamp(new Date().toString()));
    updates['orders/'+this.order.key+'/uploadedPOP/'] = true;
    updates['orders/'+this.order.key+'/status/'] = 'Awaiting Approval'; 
    updates['orders/'+this.order.key+'/audit/pendingPaymentDone/'] = true;
    updates['orders/'+this.order.key+'/audit/pendingPaymentDate/'] = date; 
    this.db.database.ref().update(updates);
  }

  dateToTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

   dismiss() {
    this.viewCtrl.dismiss();
  }
}
