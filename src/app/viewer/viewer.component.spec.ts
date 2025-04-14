import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ViewerComponent } from './viewer.component';
import { ApiService } from '@services/api.service';
import { ViewportService } from '@services/viewport.service';
import { QueryParams } from '@interfaces/query-params.interface';

describe('ViewerComponent', () => {
  let component: ViewerComponent;
  let fixture: ComponentFixture<ViewerComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let viewportServiceSpy: jasmine.SpyObj<ViewportService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    // Create spy objects
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['setActTeamById', 'setActProjectById', 'getActProjectName']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    viewportServiceSpy = jasmine.createSpyObj('ViewportService', ['initRenderer', 'getViewportObject', 'updateSize', 'resetView']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], { queryParams: of({ project_id: '123', team_id: '456' }) });

    await TestBed.configureTestingModule({
      imports: [ViewerComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ViewportService, useValue: viewportServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle query params', async () => {
    // Arrange:
    const queryParams: QueryParams = { project_id: '123', team_id: '456' };
    const projectName = "ProjectName123";

    // Simulate the return of a specific project name for getActProjectName function
    apiServiceSpy.getActProjectName.and.returnValue(projectName);

    // Act:
    await component.handleQueryParams(queryParams);

    // Assert:
    expect(component.projectId).toBe('123');
    expect(component.teamId).toBe('456');
    expect(component.projectName).toBe(projectName);
    expect(apiServiceSpy.setActTeamById).toHaveBeenCalledWith('456');
    expect(apiServiceSpy.setActProjectById).toHaveBeenCalledWith('123');
    expect(viewportServiceSpy.initRenderer).toHaveBeenCalledWith('123', 'rendererViewport');
  });

  it('should navigate to /projects if project_id or team_id is missing', async () => {
    // Arrange:
    const queryParams: QueryParams = { project_id: undefined, team_id: '456' };

    // Act:
    await component.handleQueryParams(queryParams);
    component.ngOnInit();

    // Assert:
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/projects']);
  });

  it('should call updateSize on resize event', () => {
    component.onResize();
    expect(viewportServiceSpy.updateSize).toHaveBeenCalled();
  });

  it('should call resetView onResetView', () => {
    component.onResetView();
    expect(viewportServiceSpy.resetView).toHaveBeenCalled();
  });
});
