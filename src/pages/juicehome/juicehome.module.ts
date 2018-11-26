import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JuicehomePage } from './juicehome';

@NgModule({
  declarations: [
    JuicehomePage,
  ],
  imports: [
    IonicPageModule.forChild(JuicehomePage),
  ],
})
export class JuicehomePageModule {}
