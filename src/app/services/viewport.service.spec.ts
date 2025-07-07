import { TestBed } from '@angular/core/testing';
import { ViewportService } from '@services/viewport.service';
import { ApiService } from '@services/api.service';
import * as Renderer from 'bimplus-renderer';

describe('ViewportService', () => {
  let viewportService: ViewportService;
  let viewportSpy: jasmine.SpyObj<Renderer.Viewport3D>;
  let projectSpy: jasmine.SpyObj<Renderer.ProjectContent>;
  let viewerSpy: jasmine.SpyObj<Renderer.ProjectViewer>;
  let projectModelSpy: jasmine.SpyObj<Renderer.ProjectModel>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['api']);

    TestBed.configureTestingModule({
      providers: [
        ViewportService,
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    viewportService = TestBed.inject(ViewportService);

    projectSpy = jasmine.createSpyObj('ProjectContent', ['forEachModel']);
    viewerSpy = jasmine.createSpyObj('ProjectViewer', ['loadProject', 'loadModelStructure', 'getModelViewState', 'setModelViewState']);
    viewportSpy = jasmine.createSpyObj('Viewport3D', ['setViewportSize', 'resetSelectionMode', 'restoreViewbox', 'resetClashScene', 'setRotationCenter', 'setCameraResetAxis', 'setSectionAxis', 'draw',]);
    projectModelSpy = jasmine.createSpyObj('ProjectModel', ['forEachLayer', 'setCurrentRevision', 'getLatestRevision']);

    viewportService.project = projectSpy;
    viewportService.viewer = viewerSpy;
    viewportService.viewport = viewportSpy;
  });

  it('should be created', () => {
    expect(viewportService).toBeTruthy();
  });

  it('should reset the view', () => {
    viewportService.resetView();

    expect(viewportSpy.resetSelectionMode).toHaveBeenCalled();
    expect(viewportSpy.restoreViewbox).toHaveBeenCalled();
    expect(viewportSpy.resetClashScene).toHaveBeenCalled();
    expect(viewportSpy.setRotationCenter).toHaveBeenCalledWith(null);
  });

  it('should return the viewport object', () => {
    const result = viewportService.getViewportObject();

    expect(result).toBe(viewportSpy);
  });

  it('should update the viewport size', () => {
    viewportService.updateSize();

    expect(viewportSpy.setViewportSize).toHaveBeenCalled();
  });

  it('should set the camera reset axis', () => {
    const view = 'x';
    viewportService.setView(view);

    expect(viewportSpy.setCameraResetAxis).toHaveBeenCalledWith(view);
  });

  it('should set the section axis', () => {
    const axis = 'y';
    viewportService.setSectionAxis(axis);

    expect(viewportSpy.setSectionAxis).toHaveBeenCalledWith(axis);
  });

  it('should set model visibility for the specified model ID', () => {
    const modelId = '123';
    const value = true;

    const layerSpy = jasmine.createSpyObj('layer', ['setVisible']);

    const model = projectModelSpy;
    model.id = modelId;
    model.visible = false;
    model.forEachLayer = jasmine.createSpy('forEachLayer').and.callFake((callback) => callback(layerSpy));

    projectSpy.forEachModel.and.callFake((callback) => callback(model));

    viewportService.setModelVisibility(modelId, value);

    expect(layerSpy.setVisible).toHaveBeenCalledWith(value);
  });

  it('should show specified models', () => {
    const layerSpy1 = jasmine.createSpyObj('layer1', ['setVisible']);
    const model1: Renderer.ProjectModel =
    {
      id: '123',
      name: 'model1',
      visible: true,
      divisionTopologyId: 'divisionTopologyId',
      layers: [{ id: 'layer1', name: 'layer1' } as Renderer.ProjectLayer],
      revisions: [1, 2, 3],
      releasedRevisions: [1, 2, 3],
      currentRevision: 1,
      parentProject: projectSpy,
      objectsLoaded: true,

      setCurrentRevision: jasmine.createSpy(),
      getCurrentRevision: jasmine.createSpy(),
      getLatestRevision: jasmine.createSpy(),
      forEachLayer: jasmine.createSpy('forEachLayer').and.callFake((callback) => callback(layerSpy1)),
      getLayerArray: jasmine.createSpy(),
      setVisible: jasmine.createSpy(),
      isVisible: jasmine.createSpy(),
      forEachTopologyLeafNode: jasmine.createSpy()
    };

    const layerSpy2 = jasmine.createSpyObj('layer2', ['setVisible']);
    const model2: Renderer.ProjectModel =
    {
      id: '456',
      name: 'model1',
      visible: true,
      divisionTopologyId: 'divisionTopologyId',
      layers: [{ id: 'layer1', name: 'layer1' } as Renderer.ProjectLayer],
      revisions: [1, 2, 3],
      releasedRevisions: [1, 2, 3],
      currentRevision: 1,
      parentProject: projectSpy,
      objectsLoaded: true,

      setCurrentRevision: jasmine.createSpy(),
      getCurrentRevision: jasmine.createSpy(),
      getLatestRevision: jasmine.createSpy(),
      forEachLayer: jasmine.createSpy('forEachLayer').and.callFake((callback) => callback(layerSpy2)),
      getLayerArray: jasmine.createSpy(),
      setVisible: jasmine.createSpy(),
      isVisible: jasmine.createSpy(),
      forEachTopologyLeafNode: jasmine.createSpy()
    };

    const models: Renderer.ProjectModel[] = [model1, model2];

    projectSpy.forEachModel.and.callFake((callback) => {
      callback(model1);
      callback(model2);
    });

    viewportService.showModels(models);

    expect(layerSpy1.setVisible).toHaveBeenCalled();
    expect(layerSpy2.setVisible).toHaveBeenCalled();
    expect(viewportSpy.draw).toHaveBeenCalled();
  });

  it('should return decorated models', () => {
    const layerSpy = jasmine.createSpyObj('layer', ['isVisible']);

    const model = projectModelSpy;
    model.forEachLayer = jasmine.createSpy('forEachLayer').and.callFake((callback) => callback(layerSpy));
    projectSpy.forEachModel.and.callFake((callback) => callback(model));

    const decoratedModels = viewportService.getProjectModels();

    expect(decoratedModels.length).toBe(1);
    expect(layerSpy.isVisible).toHaveBeenCalled();
  });

  it('should log a message when an object is selected', () => {
    spyOn(console, 'log'); // Spy on console.log

    viewportService.onSelectObject();

    expect(console.log).toHaveBeenCalledWith('Object selected.');
  });

  xit('should initialize renderer and load project', async () => {
    const projectId = '123';
    const domElementId = 'viewport-container';

    const model1: Renderer.ProjectModel = {
      id: 'model1',
      name: 'model1',
      visible: true,
      divisionTopologyId: 'divisionTopologyId',
      layers: [{ id: 'layer1', name: 'layer1' } as Renderer.ProjectLayer],
      revisions: [1, 2, 3],
      releasedRevisions: [1, 2, 3],
      currentRevision: 1,
      parentProject: projectSpy,
      objectsLoaded: true,

      setCurrentRevision: jasmine.createSpy(),
      getCurrentRevision: jasmine.createSpy(),
      getLatestRevision: jasmine.createSpy(),
      forEachLayer: jasmine.createSpy(),
      getLayerArray: jasmine.createSpy(),
      setVisible: jasmine.createSpy(),
      isVisible: jasmine.createSpy(),
      forEachTopologyLeafNode: jasmine.createSpy()
    };
    const model2: Renderer.ProjectModel = {
      id: 'model2',
      name: 'model2',
      visible: true,
      divisionTopologyId: 'divisionTopologyId',
      layers: [{ id: 'layer1', name: 'layer1' } as Renderer.ProjectLayer],
      revisions: [1, 2, 3],
      releasedRevisions: [1, 2, 3],
      currentRevision: 1,
      parentProject: projectSpy,
      objectsLoaded: true,

      setCurrentRevision: jasmine.createSpy(),
      getCurrentRevision: jasmine.createSpy(),
      getLatestRevision: jasmine.createSpy(),
      forEachLayer: jasmine.createSpy(),
      getLayerArray: jasmine.createSpy(),
      setVisible: jasmine.createSpy(),
      isVisible: jasmine.createSpy(),
      forEachTopologyLeafNode: jasmine.createSpy()
    };

    projectSpy.forEachModel.and.callFake(async (callback) => {
      callback(model1);
      callback(model2);
    });

    const mockMvs: Renderer.ModelViewState = {} as Renderer.ModelViewState;
    viewerSpy.loadProject.and.returnValue(Promise.resolve(projectSpy));
    viewerSpy.getModelViewState.and.returnValue(mockMvs);
    viewerSpy.setModelViewState.and.returnValue(Promise.resolve());

    await viewportService.initRenderer(projectId, domElementId);

    expect(viewportSpy).toBeDefined();
    expect(viewerSpy.loadProject).toHaveBeenCalledWith(projectId, undefined);
    expect(projectSpy.forEachModel).toHaveBeenCalled();
    expect(model1.setCurrentRevision).toHaveBeenCalled();
    expect(model2.setCurrentRevision).toHaveBeenCalled();
    expect(viewerSpy.loadModelStructure).toHaveBeenCalledTimes(2);
    expect(viewerSpy.getModelViewState).toHaveBeenCalledTimes(2);
    expect(viewerSpy.setModelViewState).toHaveBeenCalledTimes(2);
  });

});
