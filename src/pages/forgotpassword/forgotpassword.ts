import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NavController, ToastController, LoadingController, Loading, MenuController} from 'ionic-angular';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
  forgotPasswordForm: FormGroup;
  submitAttempt: boolean = false;
  showServerError: boolean = false;
  public user = {
    email: '',
    password: '',
    confirmPassword: ''
  }
  constructor(private menuCtrl: MenuController, public formBuilder: FormBuilder,public toastCtrl: ToastController, public loadingCtrl: LoadingController,public navCtrl: NavController) {
    
     this.forgotPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

}
