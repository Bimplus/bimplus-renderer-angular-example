import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ViewerComponent } from './viewer/viewer.component';


const routes: Routes = [
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'viewer', component: ViewerComponent, canActivate: [AuthGuard] },
  { path: '',
    redirectTo: '/projects',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuard] 
})
export class AppRoutingModule { }
