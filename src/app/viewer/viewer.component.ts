import { ViewportService } from './../services/viewport.service';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class ViewerComponent implements OnInit {
  
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router : Router,
    private viewportService : ViewportService
  ) { }

  projectId = "";
  projectName = "";
  teamId = "";

  viewport = null;

  ngOnInit() {
    this.route.queryParams
    .subscribe(async params => {
      console.log(params);

      this.projectId = params.project_id;
      this.teamId = params.team_id;

      if (!this.projectId || !this.teamId){
        this.router.navigate(['/projects']);
      }

      //--- set team and project -----------------------------------------------------------------------
      await this.apiService.setActTeamById(this.teamId);
      await this.apiService.setActProjectById(this.projectId);

      this.projectName= this.apiService.getActProjectName();

      this.initRenderer();
    });
  }

  /**--------------------------------------------------------------------------
  * init bimplus renderer
  --------------------------------------------------------------------------*/
  async initRenderer(){
    await this.viewportService.initRenderer(this.projectId, "rendererViewport");
    this.viewport = this.viewportService.getViewportObject();
  }

  /**--------------------------------------------------------------------------
  * handle resize event
  --------------------------------------------------------------------------*/
  onResize(event){
    this.viewportService.updateSize();
  }

  /**--------------------------------------------------------------------------
  * reset view
  --------------------------------------------------------------------------*/
  onResetView(){
    this.viewportService.resetView();
  }
}
