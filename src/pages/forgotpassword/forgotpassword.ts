import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NavController, ToastController, LoadingController, Loading, MenuController, AlertController } from 'ionic-angular';
import { UserserviceProvider } from '../../providers/userservice/userservice';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
  providers: [UserserviceProvider]
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
  constructor(private menuCtrl: MenuController, public formBuilder: FormBuilder, public alertCtrl: AlertController,public toastCtrl: ToastController, public userService: UserserviceProvider, public loadingCtrl: LoadingController,public navCtrl: NavController) {
    
     this.forgotPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  resetPassword(){
    if (this.forgotPasswordForm.valid){   
      this.userService.resetPassword(this.forgotPasswordForm.value.email)
      .then((user) => {
        let alert = this.alertCtrl.create({
          message: "We sent you a reset link to your email",
          buttons: [
            {
              text: "Ok",
              role: 'cancel',
              handler: () => { this.navCtrl.pop(); }
            }
          ]
        });
        alert.present();
  
      }, (error) => {
        var errorMessage: string = error.message;
        let errorAlert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [{ text: "Ok", role: 'cancel' }]
        });
        errorAlert.present();
      });
    }
  }

}
