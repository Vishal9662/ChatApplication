import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: "", redirectTo: "user", pathMatch: "full" },
  { path: "user", component: UserComponent },
  { path: "chat", component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
