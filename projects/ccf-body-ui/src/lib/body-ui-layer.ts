import { CompositeLayer, COORDINATE_SYSTEM } from '@deck.gl/core';
import { ScenegraphLayer, SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { load, registerLoaders } from '@loaders.gl/core';
import { DracoLoader, DracoWorkerLoader } from '@loaders.gl/draco';
import { GLTFLoader } from '@loaders.gl/gltf';
import { CubeGeometry } from '@luma.gl/core';
import { Matrix4 } from '@math.gl/core';


// Programmers Note: had to disable tslint in a few places due to deficient typings.

export interface SpatialSceneNode {
  '@id': string;
  '@type': string;
  unpickable?: boolean;
  wireframe?: boolean;
  _lighting?: string;
  scenegraph?: string;
  scenegraphNode?: string;
  zoomBasedOpacity?: boolean;
  color?: [number, number, number, number];
  transformMatrix: Matrix4;
  tooltip: string;
}

// tslint:disable: no-unsafe-any
async function loadGLTF(model: SpatialSceneNode): Promise<unknown> {
  const gltf = await load(model.scenegraph, GLTFLoader, {DracoLoader, decompress: true, postProcess: true});

  const scenegraphNode = model.scenegraphNode ? gltf.nodes?.find((n) => n.name === model.scenegraphNode) : undefined;
  if (scenegraphNode) {
    if (!scenegraphNode.rotation && gltf.scene?.nodes?.length > 0) {
      scenegraphNode.rotation = gltf.scene.nodes[gltf.scene.nodes.length-1].rotation;
    }
    gltf.scene = {
      id: 'scene-1',
      name: 'Scene',
      nodes: [scenegraphNode]
    };
    gltf.scenes = [gltf.scene, ...gltf.scenes];
  }
  return gltf;
}
// tslint:enable: no-unsafe-any

function meshLayer(id: string, data: SpatialSceneNode[], options: {[key: string]: unknown}): SimpleMeshLayer<unknown> | undefined {
  if (!data || data.length === 0) {
    return undefined;
  } else {
    return new SimpleMeshLayer({
      ...{
        id,
        pickable: true,
        autoHighlight: true,
        highlightColor: [30, 136, 229, 0.5*255],
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data,
        // tslint:disable-next-line: no-unsafe-any
        mesh: new CubeGeometry(),
        wireframe: false,
        getTransformMatrix: (d) => (d as {transformMatrix: number[][]}).transformMatrix,
        getColor: (d) => (d as {color: [number, number, number, number]}).color || [255, 255, 255, 0.9*255]
      },
      ...options
    });
  }
}

export class BodyUILayer extends CompositeLayer<SpatialSceneNode> {

  initializeState(): void {
    const { data } = this.props;
    this.setState({data: data || [], zoomOpacity: 0.8});

    // tslint:disable-next-line: no-unsafe-any
    registerLoaders([DracoWorkerLoader, GLTFLoader]);
  }

  renderLayers(): unknown[] {
    const state = this.state as {data: SpatialSceneNode[], zoomOpacity: number};
    const cubes = state.data.filter(d => !d.scenegraph && !d.wireframe);
    const wireframes = state.data.filter(d => !d.scenegraph && d.wireframe);
    const models = state.data.filter(d => !!d.scenegraph);

    return [
      meshLayer('cubes', cubes, {wireframe: false}),
      meshLayer('wireframes', wireframes, {wireframe: true, pickable: false}),
      ...models.map((model) =>
        new ScenegraphLayer({
          ...{
            id: 'models-' + model['@id'],
            opacity: model.zoomBasedOpacity ? state.zoomOpacity : 1.0,
            pickable: !model.unpickable,
            coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
            data: [model],
            scenegraph: model.scenegraphNode ? loadGLTF(model) : model.scenegraph,
            _lighting: model._lighting,  // 'pbr' | undefined
            getTransformMatrix: model.transformMatrix,
            getColor: model.color || [0, 255, 0, 0.5*255],
          }
        })
      )
    ].filter(l => !!l);
  }

  getPickingInfo(e: {info: object}): unknown {
    return e.info;
  }
}

// Some Deck.gl things to set (which look ugly, but is required)
((BodyUILayer as unknown) as {layerName: string}).layerName = 'BodyUILayer';
