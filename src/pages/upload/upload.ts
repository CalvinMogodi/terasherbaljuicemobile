import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';
import { Base64 } from '@ionic-native/base64';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { LoginPage } from '../login/login';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {
  uid: any;
  paymentReference: any;
  loader: any;
  constructor(public afStorage: AngularFireStorage, public db: AngularFireDatabase, public platform: Platform, private fileChooser: FileChooser, private filePath: FilePath, public iosFilePicker: IOSFilePicker, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,public toast: ToastController) {
    this.uid = navParams.get('userData');
    this.paymentReference = navParams.get('paymentReference');
  }

  uploadDocument() {    
    if (this.platform.is('ios')) {
      this.pickFileFromIOSDevice();
    }
    else if (this.platform.is('android')) {
      this.pickFileFromAndroidDevice();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

   pickFileFromIOSDevice() {
    this.iosFilePicker.pickFile().then(uri => {
      this.loader = this.loadingCtrl.create({
      content: "uploading...",
    });
    this.loader.present();
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
            this.inserUserPOPImage(imgBlob, this.uid)
          }
        })
      })
    }
  }

  pickFileFromAndroidDevice() {
    this.fileChooser.open().then(uri => {
     this.loader = this.loadingCtrl.create({
      content: "Uploading...",
    });
    this.loader.present();
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
      duration: 6000,
      position: 'top'
    });
    toast.present();
  }

  inserUserPOPImage(file, userId) {
    var storageRef = this.afStorage.storage.ref();
    var imageRef = storageRef.child('initiationFee/' + userId);
    imageRef.put(file).then(snapshot => {
      this.showError('Proof of payment is uploaded successful.');
      this.updateUser();
       this.loader.dismiss();
        this.navCtrl.setRoot(LoginPage);
    });
  }

  updateUser() {
    var updates = {};
    updates['users/' + this.uid + '/uploadedPOP'] = true;
    this.db.database.ref().update(updates);
  }

}
