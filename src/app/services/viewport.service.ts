import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
// import * as jQuery from 'jquery'; // package @types/jquery
import * as Renderer from 'bimplus-renderer';

// declare let $: typeof jQuery;
import $ from 'jquery';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  // --- renderer stuff -----------------------------------------------------------------------
  viewport!: Renderer.Viewport3D | null;
  viewer!: Renderer.ProjectViewer | null;
  project!: Renderer.ProjectContent | null;

  metricUnits: Renderer.MeasurementUnits = {
    weight: {
      multiplicator: 0.001,
      precision: 2,
      unit: 'kg',
    },
    length: {
      multiplicator: 0.001,
      precision: 2,
      unit: 'm',
    },
    width: {
      multiplicator: 0.001,
      precision: 2,
      unit: 'm',
    },
    height: {
      multiplicator: 0.001,
      precision: 2,
      unit: 'm',
    },
    area: {
      multiplicator: 0.000001,
      precision: 2,
      unit: 'm²',
    },
    volume: {
      multiplicator: 1e-9,
      precision: 2,
      unit: 'm³',
    },
  };
  imperialUnits: Renderer.MeasurementUnits = {
    length: {
      multiplicator: 0.00328083989,
      precision: 2,
      unit: 'feet',
    },
    width: {
      multiplicator: 0.00328083989,
      precision: 2,
      unit: 'feet',
    },
    height: {
      multiplicator: 0.00328083989,
      precision: 2,
      unit: 'feet',
    },
  };

  viewportSettings: Renderer.ViewportSettings = {
    defaultOpacity: 0.5,
    disciplineOpacity: 0.1,
    pinSizeScaleFactor: 2,
    maxWebGLBufferSize: 350e12,
    mixedModelMode: true,
    pinFlyToDistance: 20000,
    nearClippingPlane: 0.01,
    slideThmbSize: [180, 112],
    units: {
      mm: this.metricUnits,
      inch: {},
    },

    // Enable usage of frame selecton
    //   BlueBlue:    (LEFT  MOUSE BUTTON) + SHIFT key
    //   GreenGreen:  (LEFT  MOUSE BUTTON) + CTRL key
    //                (RIGHT MOUSE BUTTON) + CTRL key
    useFrameSelection: true,
  };

  units = {
    Metric: this.metricUnits,
    Imperial: this.imperialUnits,
  };

  viewportName: string = "mainRendererViewport";

  constructor(private apiService: ApiService) { }

  // --------------------------------------------------------------------------
  // get viewport object
  // --------------------------------------------------------------------------
  getViewportObject() {
    return this.viewport;
  }

  // --------------------------------------------------------------------------
  // init bimplus renderer
  // --------------------------------------------------------------------------
  async initRenderer(projectId: string, domElementId: string) {
    this.viewport = new Renderer.Viewport3D({
      settings: this.viewportSettings,
      units: this.units.Metric,
      domElementId,
      GPUPick: true,
      api: this.apiService.api,
      name: this.viewportName,
    });

    this.viewer = new Renderer.ProjectViewer(
      this.apiService.api,
      this.viewport
    );

    this.project = await this.viewer.loadProject(projectId, undefined);

    const models = await this.project.getModels();

    for (const model of models) {
      model.setCurrentRevision(model.getLatestRevision()); // use the lastes revision of a model
      await this.viewer.loadModelStructure(model);
      const mvs = this.viewer.getModelViewState(model.id);
      mvs.setLayersVisible(true);
      mvs.setLeafNodesVisible(true);
      await this.viewer.setModelViewState(mvs);
    }

    // --- handle events -----------------------------------------------------------------------
    $(this.viewport.domElement).on('select3DObject', (/*e*/) => {
      this.onSelectObject();
    });
  }

  // --------------------------------------------------------------------------
  // handle object selection
  // --------------------------------------------------------------------------
  onSelectObject() {
    console.log(`Object selected.`);
  }

  // --------------------------------------------------------------------------
  // update viewport size
  // --------------------------------------------------------------------------
  updateSize() {
    this.viewport.setViewportSize();
  }

  // --------------------------------------------------------------------------
  // reset view
  // --------------------------------------------------------------------------
  resetView() {
    this.viewport.resetSelectionMode();
    this.viewport.restoreViewbox();
    this.viewport.resetClashScene();
    this.viewport.setRotationCenter(null);
    // Set specific view
    // this.setView("x");
  }

  // --------------------------------------------------------------------------
  // set view
  // --------------------------------------------------------------------------
  setView(view: string) {
    this.viewport.setCameraResetAxis(view);
  }

  // --------------------------------------------------------------------------
  // set section axis
  // --------------------------------------------------------------------------
  setSectionAxis(axis: string) {
    this.viewport.setSectionAxis(axis);
  }

  // --------------------------------------------------------------------------
  // set model visibility
  // --------------------------------------------------------------------------
  setModelVisibility(modelId: string, value: boolean) {
    this.project.forEachModel((model: Renderer.ProjectModel) => {
      if (model.id === modelId) {
        model.forEachLayer((layer: Renderer.ProjectLayer) => {
          layer.setVisible(value);
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // models to show
  // --------------------------------------------------------------------------
  showModels(models: Renderer.ProjectModel[]) {
    this.project.forEachModel((model: Renderer.ProjectModel) => {
      const modelVisible = models.find((item) => item.id === model.id);
      this.setModelVisibility(model.id, modelVisible != null);
    });
    this.viewport.draw();
  }

  // --------------------------------------------------------------------------
  // get list of project models
  // --------------------------------------------------------------------------
  getProjectModels() {
    const decoratedModels: Renderer.ProjectModel[] = [];
    this.project.forEachModel((model: Renderer.ProjectModel) => {
      model.forEachLayer((layer: Renderer.ProjectLayer) => (model.visible = layer.isVisible()));
      decoratedModels.push(model);
    });

    return decoratedModels;
  }
}
