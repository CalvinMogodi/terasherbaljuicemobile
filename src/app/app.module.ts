import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { Base64 } from '@ionic-native/base64';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { TermsandconditionsPage } from '../pages/termsandconditions/termsandconditions';
import { OrderdetailsPage } from '../pages/orderdetails/orderdetails';
import { RegisterPage } from '../pages/register/register';
import { UploadPage } from '../pages/upload/upload';
import { OrderPage } from '../pages/order/order';
import { OrderhistoryPage } from '../pages/orderhistory/orderhistory';
import { CartPage } from '../pages/cart/cart';
import { ProfilePage } from '../pages/profile/profile';
import { AwaitingApprovalPage } from '../pages/awaitingapproval/awaitingapproval';
import { CardpaymentPage } from '../pages/cardpayment/cardpayment';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AboutappPage } from '../pages/aboutapp/aboutapp';
import { ContactusPage } from '../pages/contactus/contactus';
import { HowtousejuicePage } from '../pages/howtousejuice/howtousejuice';
import { JuicebenefitsPage } from '../pages/juicebenefits/juicebenefits';
import { JuicehomePage } from '../pages/juicehome/juicehome';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HTTP } from '@ionic-native/http';
import { HttpClientModule } from '@angular/common/http'
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { UserserviceProvider } from '../providers/userservice/userservice';
import { IonicStorageModule } from '@ionic/storage';

var config = {
  apiKey: "AIzaSyAG_crKE7xA6cevn4x1FbgFVXKtDSD_zhM",
  authDomain: "terasherbaljuice.firebaseapp.com",
  databaseURL: "https://terasherbaljuice.firebaseio.com",
  projectId: "terasherbaljuice",
  storageBucket: "terasherbaljuice.appspot.com",
  messagingSenderId: "939142186985"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    RegisterPage,
    UploadPage,
    OrderPage,
    CartPage,
    ProfilePage,
    ForgotpasswordPage,
    TermsandconditionsPage,
    AwaitingApprovalPage,
    OrderhistoryPage,
    OrderdetailsPage,
    CardpaymentPage,
    AboutappPage,
    ContactusPage,
    HowtousejuicePage,
    JuicebenefitsPage,
    JuicehomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireStorageModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['sqlite', 'indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    RegisterPage,
    UploadPage,
    OrderPage,
    CartPage,
    ProfilePage,
    ForgotpasswordPage,
    TermsandconditionsPage,
    AwaitingApprovalPage,
    OrderhistoryPage,
    OrderdetailsPage,
    CardpaymentPage,
    AboutappPage,
    ContactusPage,
    HowtousejuicePage,
    JuicebenefitsPage,
    JuicehomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserserviceProvider,
    FileTransfer,
    FileTransferObject,
    FileChooser,
    IOSFilePicker,
    Camera,
    Base64,
    File,
    FilePath,
    InAppBrowser
  ]
})
export class AppModule {}
