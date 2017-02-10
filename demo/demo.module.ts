import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GridModule } from '../src/grid.module';

import { DemoComponent }  from './demo.component';

/**
 * Demo module class.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-beta.1
 */
@NgModule({
  imports:      [ BrowserModule, GridModule ],
  declarations: [ DemoComponent ],
  bootstrap:    [ DemoComponent ]
})
export class DemoModule { }
