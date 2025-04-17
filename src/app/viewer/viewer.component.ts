import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ViewportService } from '@services/viewport.service';
import { ApiService } from '@services/api.service';
import { QueryParams } from '@interfaces/query-params.interface';
import * as Renderer from 'bimplus-renderer';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  standalone: true,
})
export class ViewerComponent implements OnInit {

  // Use HostListener to listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(/*event: any*/) {
    this.viewportService.updateSize();
  }

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private viewportService: ViewportService
  ) { }

  projectId: string = '';
  projectName: string = '';
  teamId: string = '';
  viewport: Renderer.Viewport3D | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.handleQueryParams(params as QueryParams);
    });
  }

  async handleQueryParams(params: QueryParams) {

    this.projectId = params.project_id;
    this.teamId = params.team_id;

    if (!this.projectId || !this.teamId) {
      this.router.navigate(['/projects']);
      return; // Return early to prevent further execution
    }

    // --- set team and project -----------------------------------------------------------------------
    await this.apiService.setActTeamById(this.teamId);
    await this.apiService.setActProjectById(this.projectId);

    this.projectName = this.apiService.getActProjectName();

    this.initRenderer();
  }

  // --------------------------------------------------------------------------
  // init bimplus renderer
  // --------------------------------------------------------------------------
  async initRenderer() {
    await this.viewportService.initRenderer(this.projectId, 'rendererViewport');
    this.viewport = this.viewportService.getViewportObject();
  }

  // --------------------------------------------------------------------------
  // reset view
  // --------------------------------------------------------------------------
  onResetView() {
    this.viewportService.resetView();
  }

  // --------------------------------------------------------------------------
  // Toggle camera type
  // --------------------------------------------------------------------------
  onToggleCameraType() {
    this.viewportService.toggleCameraType();
  }

}
