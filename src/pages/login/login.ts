import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading, MenuController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { AwaitingApprovalPage } from '../awaitingapproval/awaitingapproval';
import { UploadPage } from '../upload/upload';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { TermsandconditionsPage } from '../termsandconditions/termsandconditions';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserserviceProvider]
})
export class LoginPage {
  loginForm: FormGroup;
  submitAttempt: boolean = false;
  showError: boolean = false;
  dbUser: any;
  loader: any;
  public user = {
    email: '',
    password: '',
  }
  public fireAuth: any;
  constructor(public afAuth: AngularFireAuth,public db: AngularFireDatabase, private storage: Storage, public userService: UserserviceProvider, 
      public navCtrl: NavController, public formBuilder: FormBuilder,
       public toastCtrl: ToastController, public loadingCtrl: LoadingController,
       public http: Http, private menuCtrl: MenuController) {

    this.menuCtrl.enable(false);
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });

    this.fireAuth = afAuth.auth;
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  forgotpassword() {
     this.navCtrl.push(ForgotpasswordPage);
  }
  termsandconditions(){
    this.navCtrl.push(TermsandconditionsPage);
  }

  isANumber(str){
    return !/\D/.test(str);
  }

  signIn() {
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      this.loader = this.loadingCtrl.create({
        content: "Please wait..."
      });

      this.loader.present();

      if(this.isANumber(this.user.email)){
        var refForOrders = this.db.database.ref();
        refForOrders.child('users').orderByChild('cellPhone').equalTo(this.user.email).once('value', snapshot => {
            var result = snapshot.val();
            if(result != null){
             snapshot.forEach(snap =>{
              var user = snap.val();          
                this.loginUser(user.email, this.user.password);             
             });
            }    
        });         
      }else{
        this.loginUser(this.user.email, this.user.password);
    }
    }
  }

  loginUser(username, password){
    this.userService.loginUser(username, password).then(authData => {
        //get data from db
        this.db.database.ref('users/' + authData.user.uid).once('value', (snapshot) =>{
            //return snapshot.val() || 'Anoynymous';
            var user = snapshot.val();
            if(user != null){
              this.dbUser = user;
              this.storage.set("id", authData.uid);
              this.userService.setUid(authData.uid);
              var test = this.userService.getUid();
              
              if(user.isActive)
              {
                  this.loader.dismiss();
                  this.navCtrl.setRoot(HomePage, {
                      userData: test
                  });
              }
              else if(user.uploadedPOP){
                this.loader.dismiss();
                  this.navCtrl.push(AwaitingApprovalPage, {
                      userData: authData.uid
                  });              
              }
              else
              {
                 this.loader.dismiss();
                 this.navCtrl.push(UploadPage, {
                      userData: authData.uid,
                      paymentReference: this.dbUser.paymentReference
                  });                
              }
            }     
        });

      }, error => {
        this.loader.dismiss();
        this.showError = true;
      });
  }

}
