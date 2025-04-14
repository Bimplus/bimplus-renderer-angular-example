How to use Bimplus Renderer and Bimplus WebSdk in Angular application : 

- add Bimplus packages via npm into your project via command
  npm install bimplus-websdk --save-dev
  npm install bimplus-renderer --save-dev
   
- check if your project is already using jquery. If not add into index.html jquery script loading : 
  e.g.  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  
  Note: Allplan Bimplus packages require jquery 
  
- in angular.json add loading of necessary assets from bimplus-renderer npm package into your project.
  Add loading of bimplus assets in assets section : 
  "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "node_modules/bimplus-renderer/dist/bimplus-renderer-assets",
                "output": "./node_modules/bimplus-renderer/dist/bimplus-renderer-assets"
              }
            ],

- now you can use both packages in your angular application



How to work with Bimplus WebSdk (see file api.service.ts in this example):

- it's recommended to put Bimplus WebSdk object into the service to have access to it everywhere in the application

- create angular service 

- first import websdk
  import * as WebSdk from 'bimplus-websdk';
  
- initialize the websdk object 
  const environment = "dev";
  this.api = new WebSdk.Api(WebSdk.createDefaultConfig(environment));    

- after initialization you can use all websdk functions e.g. 
  this.api.authorize.post(email,password, appId)



How to work with Bimplus Renderer (see file viewport.service.ts in this example):

- add into your application element where you want to render bimplus renderer content.
  This element must have unique id. In our example we add div element in viewer.component.html : 
  
  <div id="rendererViewport" ></div>

- in component or service import the bimplus-renderer 
  
  import * as Renderer from 'bimplus-renderer';

- initialize renderer object. We use "rendererViewport" id to identify element where we want to render content :

    this.viewport = new Renderer.Viewport3D({
      settings: rendererSettings,
      units: units,
      "rendererViewport",
      GPUPick: true
    });

	NOTE : Please refer to bimplus renderer documentation to see JSON renderer settings options

- use bimplus-renderer project viewer to load project models and display it. Project viewer uses bimplus-websdk object to load data. 
  In this example we use this code to show all models in the project : 
  
    this.viewer = new Renderer.ProjectViewer(this.apiService.api, this.viewport);
    this.project = await this.viewer.loadProject(projectId);

    let promises = [];

    // --- show all project models -----------------------------------------------------------------------
    this.projectData.forEachModel((model) => {
      model.setCurrentRevision(model.getLatestRevision());
      await this.viewer.loadModelStructure(model);
      let mvs = this.viewer.getModelViewState(model.id);
      mvs.setLayersVisible(true);
      mvs.setLeafNodesVisible(true);
      await this.viewer.setModelViewState(mvs);
    })

    await Promise.all(promises);

	NOTE : Bimplus-WebSdk api object needs to be correctly initialized and user must be logged in to be able to load project models.
