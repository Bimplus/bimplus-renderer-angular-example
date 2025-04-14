import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { ApiService } from '@services/api.service';
import * as WebSdk from 'bimplus-websdk';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
    imports: [NgForOf]
})
export class ProjectsComponent implements OnInit {
  loading = false;
  teams: WebSdk.TeamData[];
  projects: WebSdk.Project[];
  
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.loading = true;

    console.debug("Load Teams");
    this.apiService.getTeams().then(async (teams: WebSdk.TeamData[]) => {
      this.teams = teams;
    });

    // --- get list of all projects -----------------------------------------------------------------------
    this.apiService.getProjects().then(
      (projects: WebSdk.Project[]) => {
        this.projects = projects.map((prj: WebSdk.Project) => {
          this.loading = false;
          return prj;
        });
      },
      () => (this.loading = false)
    );
  }

  // team changed 
  async onTeamSelected (team: WebSdk.TeamData) {
    console.log('Team selected', team);
    await this.apiService.setActTeam(team.slug);
    this.loading = true;
    this.projects = await this.apiService.getProjects();
    this.loading = false;
  }

  // --- navigate to bimplus renderer viewer -----------------------------------------------------------------------
  async onOpenProject(prj: WebSdk.Project) {
    await this.apiService.setActTeam(prj.teamSlug);

    await this.router.navigate(['/viewer'], {
      queryParams: {
        team_id: this.apiService.getActTeamId(),
        project_id: prj.id,
      },
    });
  }
}
