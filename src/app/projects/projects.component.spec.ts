import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ApiService } from '@services/api.service';
import * as WebSdk from 'bimplus-websdk';

describe('ProjectsComponent', () => {

  const teams: WebSdk.TeamData[] = [
    { id: '1', name: 'Team 1', slug: 'team-slug-1' },
    { id: '2', name: 'Team 2', slug: 'team-slug-2' }
  ];

  const projects: WebSdk.Project[] = [
    { id: '1', name: 'Project 1', teamSlug: 'team-slug-1', teamName: "Team Name 1", rights: { projectAdmin: true, projectEditor: true } },
    { id: '2', name: 'Project 2', teamSlug: 'team-slug-2', teamName: "Team Name 2", rights: { projectAdmin: true, projectEditor: true } }
  ];

  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getTeams', 'getProjects', 'setActTeam', 'getActTeamId']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ProjectsComponent, RouterModule.forRoot([])],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch projects on initialization', async () => {
    mockApiService.getTeams.and.returnValue(Promise.resolve(teams));
    mockApiService.getProjects.and.returnValue(Promise.resolve(projects));

    // Trigger ngOnInit()
    fixture.detectChanges();

    // Wait for the promise to resolve
    await fixture.whenStable();

    // Check expectations after the asynchronous operation is complete
    expect(component.loading).toBe(false);
    expect(component.projects).toEqual(projects);
  });

  it('should navigate to viewer onOpenProject', async () => {
    const project: WebSdk.Project = { id: '1', name: 'Project 1', teamSlug: 'team-slug-1', teamName: "Team Name 1", rights: { projectAdmin: true, projectEditor: true } };
    const teamId: string = 'team-id-1'; // Declare teamId as string type

    // Mock the ApiService method to return a string representing the team ID
    mockApiService.getActTeamId.and.returnValue(teamId);

    await component.onOpenProject(project);

    // Verify that the setActTeam method is called with the correct team slug
    expect(mockApiService.setActTeam).toHaveBeenCalledWith(project.teamSlug);

    // Verify that the navigate method is called with the correct parameters
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/viewer'], {
      queryParams: {
        team_id: teamId, // Use the teamId variable
        project_id: project.id,
      }
    });
  });

  it('should handle error when fetching projects fails', async () => {
    mockApiService.getTeams.and.returnValue(Promise.resolve(teams));
    // Mock the getProjects method to return a rejected promise
    mockApiService.getProjects.and.returnValue(Promise.reject(new Error('Error fetching projects')));

    // Trigger ngOnInit()
    fixture.detectChanges();
    // Wait for the promise to resolve
    await fixture.whenStable();

    // Assert that loading is set to false after the error
    expect(component.loading).toBe(false);
  });

});
