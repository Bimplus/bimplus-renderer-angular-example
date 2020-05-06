import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as Renderer from 'bimplus-renderer';

declare var $:any;

@Injectable({
  providedIn: 'root'
})
export class ViewportService {

  //--- renderer stuff -----------------------------------------------------------------------
  viewport : any;
  loader : any;
  projectData : any;    

  viewportSettings = {
    "defaultOpacity": 0.5,
    "disciplineOpacity": 0.1,
    "pinSizeScaleFactor": 2,
    "maxWebGLBufferSize": 350e12,
    "mixedModelMode": true,
    "pinFlyToDistance": 20000,
    "nearClippingPlane": 0.01,

    "slideThmbSize": [
      180,
      112
    ],
    "units": {
      "mm": {
        "weight": {
          "multiplicator": 0.001,
          "unit": "kg"
        },
        "length": {
          "multiplicator": 0.001,
          "unit": "m"
        },
        "width": {
          "multiplicator": 0.001,
          "unit": "m"
        },
        "height": {
          "multiplicator": 0.001,
          "unit": "m"
        },
        "area": {
          "multiplicator": 0.000001,
          "unit": "m²"
        },
        "volume": {
          "multiplicator": 1e-9,
          "unit": "m³"
        }
      },
      "inch": {}
    }
  };

  units = {
    "Metric": {
      "weight": {
        "multiplicator": 0.001,
        "precision":2,
        "unit": "kg"
      },
      "length": {
        "multiplicator": 0.001,
        "precision":2,
        "unit": "m"
      },
      "width": {
        "multiplicator": 0.001,
        "precision":2,
        "unit": "m"
      },
      "height": {
        "multiplicator": 0.001,
        "precision":2,
        "unit": "m"
      },
      "area": {
        "multiplicator": 0.000001,
        "precision":2,
        "unit": "m²"
      },
      "volume": {
        "multiplicator": 1e-9,
        "precision":2,
        "unit": "m³"
      }
    },
    "Imperial": {
      "length": {
        "multiplicator": 0.00328083989,
        "precision":2,
        "unit": "feet"
      },
      "width": {
        "multiplicator": 0.00328083989,
        "precision":2,
        "unit": "feet"
      },
      "height": {
        "multiplicator": 0.00328083989,
        "precision":2,
        "unit": "feet"
      }
    },
  };

  constructor(
    private apiService: ApiService,
  ) {
  }

  /**--------------------------------------------------------------------------
  * get viewport object
  --------------------------------------------------------------------------*/
  getViewportObject(){
    return this.viewport;
  }

  /**--------------------------------------------------------------------------
  * init bimplus renderer
  --------------------------------------------------------------------------*/
  async initRenderer(projectId, domElementId){
    this.viewport = new Renderer.Viewport3D({
      settings: this.viewportSettings,
      units: this.units.Metric,
      domElementId,
      GPUPick: true
    });

    this.loader = new Renderer.ContentLoader(this.apiService.api, this.viewport);
    this.projectData = await this.loader.loadProject(projectId);

    let promises = [];

    //--- show all project models -----------------------------------------------------------------------
    this.projectData.forEachModel((model) => {
      var layers = model.getLayerArray();
      model.setVisible(true);
      model.visible = true;

      model.forEachTopologyLeafNode(node => {
        promises.push(this.loader.loadTopologyNode(this.projectData, node, layers));
      });

    })

    await Promise.all(promises);

    //--- handle events -----------------------------------------------------------------------    
    $(this.viewport.domElement).on('select3DObject', (e) => { 
      this.onSelectObject();
    });
  }


  /**--------------------------------------------------------------------------
  * handle object selection
  --------------------------------------------------------------------------*/
  onSelectObject(){
    console.log(`Object selected.`);
  }

  /**--------------------------------------------------------------------------
  * update viewport size
  --------------------------------------------------------------------------*/
  updateSize(){
    this.viewport.setViewportSize();
  }

  /**--------------------------------------------------------------------------
  * reset view
  --------------------------------------------------------------------------*/
  resetView(){
    this.viewport.resetSelectionMode();
    this.viewport.restoreViewbox();
    this.viewport.resetClashScene();
    this.viewport.setRotationCenter(null);
    // this.setView("x");
  }

  /**--------------------------------------------------------------------------
  * set view
  --------------------------------------------------------------------------*/
  setView(view){
    this.viewport.setCameraResetAxis(view);
  }

  /**--------------------------------------------------------------------------
  * set section axis
  --------------------------------------------------------------------------*/
  setSectionAxis(axis){
    this.viewport.setSectionAxis(axis);
  }

  /**--------------------------------------------------------------------------
  * set model visibility 
  --------------------------------------------------------------------------*/
  setModelVisibility(modelId, value){
    this.projectData.forEachModel( model => {
      if ( model.id === modelId ) {
        model.forEachLayer( layer => {
          layer.setVisible(value);
        });    
      }
    })
  }

  /**--------------------------------------------------------------------------
  * models to show
  --------------------------------------------------------------------------*/
  showModels(models){
    this.projectData.forEachModel((model) => {
      let modelVisible = models.find( item => item.id === model.id );
      this.setModelVisibility( model.id, modelVisible != null);
    })
    this.viewport.draw();
  }

  /**--------------------------------------------------------------------------
  * get list of project models
  --------------------------------------------------------------------------*/
  getProjectModels(){
    let decoratedModels = []; 
    this.projectData.forEachModel( model => { 
      model.forEachLayer( layer => model.visible = layer.isVisible() );
      decoratedModels.push(model);
    });

    return decoratedModels;
  }

}
