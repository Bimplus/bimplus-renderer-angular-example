import { Injectable } from '@angular/core';
import * as WebSdk from 'bimplus-websdk';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  api = null;

  actTeamId : "";
  actTeamSlug : "";
  actProject: any;

  constructor(
    private router : Router
  ) {
    // initialize bimplus websdk api
    // Use environment dev, stage or prod
    var environment = "dev";
    this.api = new WebSdk.Api(WebSdk.createDefaultConfig(environment));    
  }


  /**--------------------------------------------------------------------------
  * authorize by email and password
  --------------------------------------------------------------------------*/
  authorize(email, password){
    let appId = '5F43560D-9B0C-4F3C-85CB-B5721D098F7B';
    return this.api.authorize.post(email,password, appId).then((data,status,xhr) => {
      console.log(`Login ok : ${JSON.stringify(data)}`);
      //alert(`Login successfull. ${JSON.stringify(data)}`);
      this._setAuthorize(data.access_token);
      return true;
    }).catch((error) => {
        // Authorization failed
        alert("Login to Bimplus failed!");
        return false;
    });
  }

  /**--------------------------------------------------------------------------
  * check if auth is ok
  --------------------------------------------------------------------------*/
  isAuthorized() {
    return this.api.getAccessToken() != null;
  }

  //--- set auth token -----------------------------------------------------------------------
  _setAuthorize(token){
    this.api.setAccessToken(token);
    localStorage.setItem("access_token", token);  
  }

  /**--------------------------------------------------------------------------
  * logout
  --------------------------------------------------------------------------*/
  logout(){
    this._setAuthorize(null);
    this.router.navigate(['/login']);
  }

  /**--------------------------------------------------------------------------
  * get list of teams
  --------------------------------------------------------------------------*/
  getTeams() {
    return this.api.teams.get();
  }

  /**--------------------------------------------------------------------------
  * get list of projects
  --------------------------------------------------------------------------*/
  getProjects(teamSlug = null) {
    return this.api.projects.get();
  }

  /**--------------------------------------------------------------------------
  * set actual team by teamslug
  --------------------------------------------------------------------------*/
  async setActTeam(teamSlug){
    this.actTeamSlug = teamSlug;
    this.api.setTeamSlug(teamSlug);

    let teams = await this.getTeams();
    let actTeam = teams.find(team => team.slug === teamSlug);
    this.actTeamId = actTeam.id;
  }

  /**--------------------------------------------------------------------------
  * set actual team by id
  --------------------------------------------------------------------------*/
  async setActTeamById(teamId){
    let team = await this.api.teams.get(teamId);
    if (team) {
      this.actTeamSlug = team.slug;
      this.api.setTeamSlug(team.slug);
      this.actTeamId = teamId;
    }
  }

  /**--------------------------------------------------------------------------
  * get actual team id
  --------------------------------------------------------------------------*/
  getActTeamId(){
    return this.actTeamId;
  }

  /**--------------------------------------------------------------------------
  * !! TEAM must be already set to call this function !!!
  * this call sets actual project
  --------------------------------------------------------------------------*/
  async setActProjectById(prjId){
    let project = await this.api.projects.get(prjId);
    if (project){
      this.actProject = project;
    }
  }

  /**--------------------------------------------------------------------------
  * get actual project id
  --------------------------------------------------------------------------*/
  getActProjetId(){
    return this.actProject.id;
  }

  /**--------------------------------------------------------------------------
  * get actual project name
  --------------------------------------------------------------------------*/
  getActProjectName(){
    return this.actProject.name;
  }

}
