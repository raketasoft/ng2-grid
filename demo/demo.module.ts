import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GridModule } from '../src/grid.module';
import { DemoComponent } from './demo.component';

@NgModule({
  bootstrap: [DemoComponent],
  declarations: [
    DemoComponent
  ],
  imports: [
    BrowserModule,
    GridModule
  ],
})
export class DemoModule { }

