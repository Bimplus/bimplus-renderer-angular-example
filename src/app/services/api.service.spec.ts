import { ApiService } from './api.service';
import { TestBed } from '@angular/core/testing';
import * as WebSdk from 'bimplus-websdk';
import { RouterModule } from '@angular/router';

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [ApiService],
    });

    apiService = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

  it('should authorize user', () => {
    const email = 'test@example.com';
    const pw = 'pw123';

    spyOn(apiService.api.authorize, 'post').and.returnValue(Promise.resolve({ access_token: 'token' }));

    apiService.authorize(email, pw).then((result) => {
      expect(result).toBeTruthy();
    });
  });

  it('should return false when authorization fails', () => {
    const email = 'test@example.com';
    const pw = 'pw123';

    spyOn(apiService.api.authorize, 'post').and.returnValue(Promise.reject(new Error('Authorization fails')));

    apiService.authorize(email, pw).then((result) => {
      expect(result).toBeFalsy();
    });
  });

  it('should return true if access token exists', () => {
    spyOn(apiService.api, 'getAccessToken').and.returnValue('test-access-token');
    expect(apiService.isAuthorized()).toBeTrue();
  });

  it('should return false if access token does not exist', () => {
    spyOn(apiService.api, 'getAccessToken').and.returnValue(null);
    expect(apiService.isAuthorized()).toBeFalse();
  });

  it('should return teams from api', async () => {
    const mockTeams: WebSdk.TeamData[] = [
      { id: '1', name: 'Team 1', slug: 'Team Slug 1' },
      { id: '2', name: 'Team 2', slug: 'Team Slug 2' }
    ];
    spyOn(apiService.api.teams, 'get').and.returnValue(Promise.resolve(mockTeams));

    const teams = await apiService.getTeams();

    expect(teams).toEqual(mockTeams);
  });

  it('should return projects from api', async () => {
    const mockProjects: WebSdk.Project[] = [
      { id: '1', name: 'Project 1', teamSlug: "teamSlug", teamName: "Team Name", rights: { projectAdmin: true, projectEditor: true } },
      { id: '2', name: 'Project 2', teamSlug: "teamSlug", teamName: "Team Name", rights: { projectAdmin: true, projectEditor: true } },
    ];
    spyOn(apiService.api.projects, 'get').and.returnValue(Promise.resolve(mockProjects));

    const projects = await apiService.getProjects();

    expect(projects).toEqual(mockProjects);
  });

  it('should return the correct actual team id', () => {
    apiService.actTeamId = 'team-id-1';

    expect(apiService.getActTeamId()).toBe('team-id-1');
  });

  it('should return the correct actual project id', () => {
    const mockProject = { id: '1', name: 'Project 1', teamSlug: "Team Slug 1", teamName: "Team Name 1", rights: { projectAdmin: true, projectEditor: true } };
    apiService.actProject = mockProject;

    expect(apiService.getActProjetId()).toBe(mockProject.id);
  });

  it('should return the correct actual project name', () => {
    const mockProject: WebSdk.Project = { id: '1', name: 'Project 1', teamSlug: "Team Slug 1", teamName: "Team Name 1", rights: { projectAdmin: true, projectEditor: true } };
    apiService.actProject = mockProject;

    expect(apiService.getActProjectName()).toBe(mockProject.name);
  });

  it('should set the active project when provided with a valid project ID', async () => {
    // Arrange
    const projectId = 'valid-project-id';
    const mockProject: WebSdk.Project = { id: '1', name: 'Project 1', teamSlug: "Team Slug 1", teamName: "Team Name 1", rights: { projectAdmin: true, projectEditor: true } };

    // Mock the behavior of api.projects.get method
    spyOn(apiService.api.projects, 'get').and.returnValue(Promise.resolve(mockProject));

    // Act
    await apiService.setActProjectById(projectId);

    // Assert
    expect(apiService.actProject).toEqual(mockProject);
  });

  it('should not set the active project if project retrieval fails', async () => {
    // Arrange
    const projectId = 'invalid-project-id';

    // Mock the behavior of api.projects.get method to return null (project not found)
    spyOn(apiService.api.projects, 'get').and.returnValue(Promise.resolve([]));

    // Act
    await apiService.setActProjectById(projectId);

    // Assert
    expect(apiService.actProject).toBeUndefined();
  });

  it('should set the active team when provided with a valid team ID', async () => {
    // Arrange
    const teamId = 'valid-team-id';
    const mockTeam: WebSdk.TeamData = { id: teamId, slug: 'test-team-slug', name: 'test-team-name' };

    // Mock the behavior of api.teams.get method
    spyOn(apiService.api.teams, 'get').and.returnValue(Promise.resolve([mockTeam]));

    // Act
    await apiService.setActTeamById(teamId);

    // Assert
    expect(apiService.actTeamId).toEqual(teamId);
    expect(apiService.actTeamSlug).toEqual(mockTeam.slug);
  });

  it('should not set the active team if team retrieval fails', async () => {
    // Arrange
    const teamId = 'invalid-team-id';

    // Mock the behavior of api.teams.get method to return null (team not found)
    spyOn(apiService.api.teams, 'get').and.returnValue(Promise.resolve([]));

    // Act
    await apiService.setActTeamById(teamId);

    // Assert
    expect(apiService.actTeamId).toBeUndefined();
    expect(apiService.actTeamSlug).toBeUndefined();
  });

  it('should set active team', async () => {
    // Arrange
    const teamSlug = 'test-team';
    const teams: WebSdk.TeamData[] = [
      { id: '1', name: 'team1 name', slug: 'team1' },
      { id: '2', name: 'team2 name', slug: 'test-team' },
      { id: '3', name: 'team3 name', slug: 'team3' },
    ];

    spyOn(apiService, 'getTeams').and.returnValue(Promise.resolve(teams));

    // Act
    await apiService.setActTeam(teamSlug);

    // Assert
    expect(apiService.actTeamSlug).toEqual(teamSlug);
    expect(apiService.actTeamId).toEqual('2'); // Assuming 'test-team' has id '2'
  });

});
