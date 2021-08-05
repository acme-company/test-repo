import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalComponent } from './modal/modal.component';
import { SampleDialogComponent } from './sample-dialog/sample-dialog.component';

const routes: Routes = [
  { path: 'test', component: SampleDialogComponent },
  { path: 'test2', component: ModalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
