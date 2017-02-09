import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GridModule } from '../src/grid.module';

import { DemoComponent }  from './demo.component';

@NgModule({
  imports:      [ BrowserModule, GridModule ],
  declarations: [ DemoComponent ],
  bootstrap:    [ DemoComponent ]
})
export class DemoModule { }
