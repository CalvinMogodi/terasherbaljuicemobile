import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { JuicehomePage } from '../pages/juicehome/juicehome';
import { ProfilePage } from '../pages/profile/profile';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';
import { HowtousejuicePage } from '../pages/howtousejuice/howtousejuice';
import { JuicebenefitsPage } from '../pages/juicebenefits/juicebenefits';
import { AboutappPage } from '../pages/aboutapp/aboutapp';
import { ContactusPage } from '../pages/contactus/contactus';
import { UserserviceProvider } from '../providers/userservice/userservice';

@Component({
  templateUrl: 'app.html',
  providers: [UserserviceProvider]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  profilePicURL = 'assets/imgs/profile.png';
  rootPage: any = JuicehomePage;
  public displayname = 'Name Surname';
  public userIsLoggedIn = false;
  id: any;
  userId: any;
  public database: any;
  public pages: Array<{ title: string, component: any, icon: string, isActive: boolean }>;
  public anonymouspages: Array<{ title: string, component: any, icon: string, isActive: boolean }>;

  constructor(public afStorage: AngularFireStorage, public afAuth: AngularFireAuth, public userService: UserserviceProvider, public db: AngularFireDatabase, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events) {
    events.subscribe("gotId", (uid) => {
      this.id = uid;

    });
    this.initializeApp();
    this.userIsLoggedIn = false;
    var that = this;
    this.database = db;
    afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.userIsLoggedIn = true;
        this.userId = user.uid;
        this.db.database.ref().child('users/' + user.uid).once('value', (snapshot) => {
          var user = snapshot.val();
          if (user != null) {
            if (user.isActive) {
              user.uid = snapshot.key;
              if (user.uploadedProfileImage) {
                let storageRef = afStorage.storage.ref();
                snapshot.key
                var starsRef = storageRef.child('profileImages/' + user.uid);
                starsRef.getDownloadURL().then(url => {
                  this.profilePicURL = url;
                });
              }
            }
          }
        });
        // that.rootPage = HomePage;
        // this.nav.setRoot(HomePage,{userData: user.uid});   

      }
      else {
        that.rootPage = JuicehomePage;
        this.nav.setRoot(JuicehomePage);
      }
    })
    that.rootPage = JuicehomePage;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home', isActive: false },
      { title: 'Profile', component: ProfilePage, icon: 'person', isActive: true },
      { title: 'How to use Teras Herbal Juice', component: HowtousejuicePage, icon: 'color-fill', isActive: false },
      { title: 'Teras Juice Benefits', component: JuicebenefitsPage, icon: 'man', isActive: false },
      { title: 'About', component: AboutappPage, icon: 'people', isActive: true },
      { title: 'Contact Us', component: ContactusPage, icon: 'contacts', isActive: false },
      { title: 'Log Out', component: LoginPage, icon: 'lock', isActive: false },
    ];

    this.anonymouspages = [
      { title: 'Home', component: JuicehomePage, icon: 'home', isActive: false },
      { title: 'How to use Teras Herbal Juice', component: HowtousejuicePage, icon: 'color-fill', isActive: false },
      { title: 'Teras Juice Benefits', component: JuicebenefitsPage, icon: 'man', isActive: false },
      { title: 'About', component: AboutappPage, icon: 'people', isActive: true },
      { title: 'Contact Us', component: ContactusPage, icon: 'contacts', isActive: false },
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
    
      if (page.title == 'Log Out') {
        this.userService.logoutUser()
          .then((user) => {
            window.location.reload();
            this.nav.setRoot(JuicehomePage);
          }, (error) => {
            this.afAuth.auth.signOut();
          });

      }
    else if (page.title == 'Home') {
      this.nav.setRoot(page.component, {
        userData: this.userId
      });
    } else {
      this.nav.push(page.component, {
        profileId: this.userId
      });
    }

  }
}
