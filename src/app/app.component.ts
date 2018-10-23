import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  profilePicURL = 'assets/imgs/profile.png';
  rootPage: any = LoginPage;
  public displayname = 'Name Surname';
  id: any;
  userId: any;
  public database: any;
  pages: Array<{title: string, component: any, icon: string, isActive: boolean}>;
  
  constructor(public afStorage: AngularFireStorage,public afAuth: AngularFireAuth,public db: AngularFireDatabase, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events) {
      events.subscribe("gotId", (uid)=>{
          this.id = uid;

      });
    this.initializeApp();  
    
    var that = this;
    this.database = db;
    afAuth.auth.onAuthStateChanged( user => {
      if(user){          
          this.userId = user.uid;
          this.db.database.ref().child('users/' + user.uid).once('value', (snapshot)=>{
            var user = snapshot.val();
            if(user != null){
              if(user.uploadedProfileImage){
              let storageRef = afStorage.storage.ref();
              var starsRef = storageRef.child('profileImages' + user.uid);        
              starsRef.getDownloadURL().then( url => {
                    this.profilePicURL = url;
                });
            }
            }            
          });
          that.rootPage = HomePage;
        this.nav.setRoot(HomePage,{userData: user.uid});       
      }
      else{
        that.rootPage = LoginPage;
        this.nav.setRoot(LoginPage);
      }
    })
    that.rootPage = LoginPage;
    // used for an example of ngFor and navigation
    this.pages = [     
      { title: 'Home', component: HomePage, icon: 'home', isActive: false },
      { title: 'Profile', component: ProfilePage, icon: 'person', isActive: true },
      { title: 'Log Out', component: LoginPage, icon: 'lock', isActive: false },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if(page.title == 'Profile')
    {
      this.nav.push(page.component, {
        profileId: this.userId
      });
    }else{
      if(page.title == 'Log Out'){
          this.afAuth.auth.signOut();
      }
      this.nav.setRoot(page.component, {
          userData: this.userId
      });
    }
    
  }
}
