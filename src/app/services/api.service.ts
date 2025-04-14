import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import * as WebSdk from 'bimplus-websdk';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  api = null;

  actTeamId: string = undefined;
  actTeamSlug: string = undefined;
  actProject: WebSdk.Project | undefined = undefined;

  constructor(private router: Router) {
    // initialize bimplus websdk api. Use environment dev, stage or prod
    const websdkEnvironment = environment.websdkEnvironment;
    this.api = new WebSdk.Api(WebSdk.createDefaultConfig(websdkEnvironment));
  }

  // --------------------------------------------------------------------------
  // authorize by email and password
  // --------------------------------------------------------------------------
  authorize(email: string, password: string) {
    const appId = '5F43560D-9B0C-4F3C-85CB-B5721D098F7B';
    return this.api.authorize
      .post(email, password, appId)
      .then((data: WebSdk.AuthorizeData) => {
        console.log(`Login ok : ${JSON.stringify(data)}`);
        this._setAuthorize(data.access_token);
        return true;
      })
      .catch((error: Error) => {
        // Authorization failed
        alert('Login to Bimplus failed!');
        console.error(error);
        return false;
      });
  }

  // --------------------------------------------------------------------------
  // check if auth is ok
  // --------------------------------------------------------------------------
  isAuthorized() {
    return this.api.getAccessToken() != null;
  }

  // --- set auth token -----------------------------------------------------------------------
  _setAuthorize(token: string) {
    this.api.setAccessToken(token);
    localStorage.setItem('access_token', token);
  }

  // --------------------------------------------------------------------------
  // logout
  // --------------------------------------------------------------------------
  async logout() {
    this._setAuthorize("");
    await this.router.navigate(['/login']);
  }

  // --------------------------------------------------------------------------
  // get list of teams
  // --------------------------------------------------------------------------
  getTeams() {
    return this.api.teams.get();
  }

  // --------------------------------------------------------------------------
  // get list of projects
  // --------------------------------------------------------------------------
  getProjects(/*teamSlug = null*/) {
    return this.api.projects.get();
  }

  // --------------------------------------------------------------------------
  // set actual team by teamslug
  // --------------------------------------------------------------------------
  async setActTeam(teamSlug: string) {
    this.actTeamSlug = teamSlug;
    this.api.setTeamSlug(teamSlug);

    const teams = await this.getTeams();
    const actTeam = teams.find((team: WebSdk.TeamData) => team.slug === teamSlug);
    this.actTeamId = actTeam.id;
  }

  // --------------------------------------------------------------------------
  // set actual team by id
  // --------------------------------------------------------------------------
  async setActTeamById(teamId: string) {
    const teams = await this.api.teams.get(teamId);

    let team: WebSdk.TeamData | undefined;
    if (Array.isArray(teams)) {
      team = teams.find((team: WebSdk.TeamData) => team.id === teamId);
    } else {
      // If teams is not an array, it's a single TeamData object
      team = teams;
    }

    if (team) {
      this.actTeamSlug = team.slug;
      this.api.setTeamSlug(team.slug);
      this.actTeamId = teamId;
    }
  }


  // --------------------------------------------------------------------------
  // get actual team id
  // --------------------------------------------------------------------------
  getActTeamId() {
    return this.actTeamId;
  }

  // --------------------------------------------------------------------------
  // !! TEAM must be already set to call this function !!!
  // this call sets actual project
  // --------------------------------------------------------------------------
  async setActProjectById(prjId: string) {
    const projects = await this.api.projects.get(prjId);

    let project: WebSdk.Project | undefined;
    if (Array.isArray(projects)) {
      project = projects.find((prj: WebSdk.Project) => prj.id === prjId);
    } else {
      // If projects is not an array, it's a single Project object
      project = projects;
    }

    if (project) {
      this.actProject = project;
    }
  }

  // --------------------------------------------------------------------------
  // get actual project id
  // --------------------------------------------------------------------------
  getActProjetId() {
    return this?.actProject?.id;
  }

  // --------------------------------------------------------------------------
  // get actual project name
  // --------------------------------------------------------------------------
  getActProjectName() {
    return this?.actProject?.name ?? '';
  }
}
