import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * Generated class for the ContactusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {
  public submitAttempt: boolean = false;
  public contactUsForm: FormGroup;
  public showError: boolean = false;
  public message = {
    message: '',
    fullName: '',
    subject: '',
    emailAddress: '',
  };

  constructor(public formBuilder: FormBuilder, public http: Http, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.contactUsForm = formBuilder.group({
      message: ['', Validators.compose([Validators.required])],
      fullName: ['', Validators.compose([Validators.required])],
      subject: ['', Validators.compose([Validators.required])],
      emailAddress: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactusPage');
  }

  send() {
    this.submitAttempt = true;

    if (this.contactUsForm.valid) {
      var loader = this.loadingCtrl.create({
        content: "Please wait..."
      });

      loader.present();

      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let options = new RequestOptions({ headers: headers });
      let message =
        JSON.stringify({
          message: this.message.message,
          fullName: this.message.fullName,
          subject: this.message.subject,
          emailAddress: this.message.emailAddress,
        });

      this.http.post('http://terasherbaljuice.dedicated.co.za/api/contactus', message, options).subscribe(data => {
        if (data) {
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Your message has been sent successful.',
            duration: 2000,
            position: 'top'
          });
          toast.present(toast);
        } else {
          loader.dismiss();
          this.showError = true;
        }
      });
    }
  }

}
