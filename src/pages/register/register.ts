import { LoginPage } from '../login/login';
import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
    providers: [UserserviceProvider]
})
export class RegisterPage {
    signUpFirstForm: FormGroup;
    signUpSecondForm: FormGroup;
    submitAttempt: boolean = false;
    secondSubmitAttempt: boolean = false;
    showError: boolean = false;
    message: string;
    database: any;
    referredBy: any;
    showPasswordError = false;
    peoples = [];

    public account = {
        name: '',
        surname: '',
        cellPhone: '',
        email: '',
        password: '',
        confirmPassword: '',
        referredBy: '',
        referredByUser: '',
        address: '',
        accountNumber: '',
        profilePicture: '',
        IDNumber: '',
        bankName: '',
        userType: 'User',
        isActive: false,
        points: 0,
        displayName: '',
        country: 'South Africa',
        uploadedIDNumberPassport: false,
        uploadedProfileImage: false,
        uploadedPOP: false,
        createdDate: 0,
        changedPassword: true,
        paymentReference: '',
        referrerIsPaid: false,
        membershipNo: ''
    }
    selectImagePath = 'assets/imgs/ic_person_black.png';
    public step = 1;
    constructor(public http: Http, public db: AngularFireDatabase, private menuCtrl: MenuController, public userService: UserserviceProvider, public navCtrl: NavController, public formBuilder: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
        this.menuCtrl.enable(false);
        this.signUpFirstForm = formBuilder.group({
            email: '',
            password: ['', Validators.compose([Validators.required])],
            name: ['', Validators.compose([Validators.required])],
            surname: ['', Validators.compose([Validators.required])],
            cellPhone: ['', Validators.compose([Validators.required])],
            confirmPassword: ['', Validators.compose([Validators.required])],
        });

        this.signUpSecondForm = formBuilder.group({
            referredBy: ['', Validators.compose([Validators.required])],
            country: ['South Africa', Validators.compose([Validators.required])],
            address: ['', Validators.compose([Validators.required])],
            accountNumber: ['', Validators.compose([Validators.required])],
            IDNumber: ['', Validators.compose([Validators.required])],
            bankName: ['', Validators.compose([Validators.required])],
        });
    }

    next() {
        this.submitAttempt = true;
        if (this.account.password != this.account.confirmPassword) {
            this.showPasswordError = true;
            return false;
        }
        if (this.signUpFirstForm.valid) {
            this.step = 2;
        }
    }

    back() {
        this.step = 1;
    }

    addFocus() {
        return true;
    }

    search() {
        let txt = this.referredBy.trim();
        if (txt.length > 2) {
            let usersRef = this.db.database.ref();
            usersRef.child("users").orderByValue().startAt(txt).limitToFirst(5).once('value', snapshot => {
                this.peoples = [];
                snapshot.forEach(snap => {
                    var item = snap.val();
                    item.key = snap.key;
                    this.peoples.push(item);
                    return false;
                });
            });
        }
    }

    removeFocus() {
        return false;
    }

    addNote(item) {
        this.referredBy = item.name + ' ' + item.surname + ' - ' + item.IDNumber;
        this.account.referredByUser = item.name + ' ' + item.surname;
        this.account.referredBy = item.key;
        this.peoples = [];
    }

    dateToTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    getRandom(length) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    }

    signUp() {

        if(this.account.email == undefined || this.account.email == ''){
            this.account.email = this.account.cellPhone.trim() + 'terasherbaljuice.com';
        }
        this.showError = false;
        this.message = '';
        this.secondSubmitAttempt = true;
        this.showPasswordError = false;
        
        if (this.signUpSecondForm.valid) {
            var loader = this.loadingCtrl.create({
                content: "Please wait..."
            });

            loader.present();
            var timestamp = this.dateToTimestamp(new Date().toString());
            this.account.createdDate = timestamp;
            this.account.displayName = this.account.name + ' ' + this.account.surname;
            let text = ''
            var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
            let len = 7;
            for (var i = 0; i < len; i++)
                text += charset.charAt(Math.floor(Math.random() * charset.length));

            var charsetmn = "0123456789";
            let lenmn = 3;
            var str = '';
            for (var i = 0; i < lenmn; i++)
                str += charsetmn.charAt(Math.floor(Math.random() * charsetmn.length));

            var nameChar = this.account.name.substring(0, 1).toUpperCase();
            var surnameChar = this.account.surname.substring(0, 1).toUpperCase();
            this.account.membershipNo = nameChar + surnameChar + new Date().getFullYear() + new Date().getMonth() + new Date().getDate() + str;
            this.account.paymentReference = text;      
            this.userService.signUpUser(this.account).then(authData => {
                loader.dismiss();
                let toast = this.toastCtrl.create({
                    message: 'You have signed up successful.',
                    duration: 2000,
                    position: 'bottom'
                });
                toast.present(toast);
               // this.sendSMS();
                this.navCtrl.setRoot(LoginPage);
            }, error => {
                loader.dismiss();
                this.showError = true;
                this.message = error;
            })

        }
    }

    sendSMS() {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });
        var sms = {
            number: this.account.cellPhone,
            membershipNo: this.account.membershipNo
        }
        var jsonObject = JSON.stringify(sms);
        this.http.post('http://terasherbaljuice.dedicated.co.za/api/sms/signupsms', jsonObject, options)
            .subscribe(data => {
                var breakeHere = "";
            });
    }
}
 