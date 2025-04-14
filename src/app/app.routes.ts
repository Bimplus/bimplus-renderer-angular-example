
import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ProjectsComponent } from './projects/projects.component';
import { ViewerComponent } from './viewer/viewer.component';
import { authRoutes } from './auth/auth.routes';

export const routes: Routes = [
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'viewer', component: ViewerComponent, canActivate: [AuthGuard] },
  ...authRoutes, // ✅ Add login routes here
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
];
