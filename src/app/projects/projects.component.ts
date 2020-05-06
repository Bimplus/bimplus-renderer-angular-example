import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  loading = false;
  projects : [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;

    //--- get list of all projects -----------------------------------------------------------------------
    this.apiService.getProjects().then((projects)=>{
      this.projects = projects.map(prj => {
        this.loading = false;
        return prj;
      });
    },  () => this.loading = false);
  }

  //--- naviagate to bimplus renderer viewer -----------------------------------------------------------------------
  async onExplore(prj){
    await this.apiService.setActTeam(prj.teamSlug);

    this.router.navigate(['/viewer'], { 
      queryParams: { 
        team_id: this.apiService.getActTeamId(), 
        project_id: prj.id } 
      });
  }
  
}
