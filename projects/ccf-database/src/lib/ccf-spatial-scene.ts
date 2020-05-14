import { Matrix4, toRadians } from '@math.gl/core';

import { CCFDatabase } from './ccf-database';
import { Filter } from './interfaces';
import { getSpatialEntity } from './queries/spatial-result-n3';
import { ccf } from './util/prefixes';
import { SpatialEntity } from './spatial-types';


export interface SpatialSceneNode {
  '@id': string;
  type: 'SpatialSceneNode';
  unpickable?: boolean;
  _lighting?: string;
  scenegraph?: string;
  color?: [number, number, number, number];
  transformMatrix: Matrix4;
  tooltip: string;
}

export class CCFSpatialScene {

  constructor(private db: CCFDatabase) {}

  getReferenceBody(filter?: Filter): SpatialEntity {
    let bodyId: string;
    switch (filter?.sex) {
      case 'Male':
        bodyId = ccf.spatial.Male.id;
        break;
      case 'Female':
        bodyId = ccf.spatial.Female.id;
        break;
      case 'Both':
      default:
        bodyId = ccf.spatial.BothSexes.id;
        break;
    }
    return getSpatialEntity(this.db.store, bodyId);
  }

  getReferenceSceneNodes(filter?: Filter): SpatialSceneNode[] {
    const wholeBody = getSpatialEntity(this.db.store, ccf.spatial.Body.id);
    const body = this.getReferenceBody(filter);
    const organs = getSpatialEntity(this.db.store, ccf.spatial.FemaleOrgans.id);
    return [
      this.getSceneNode(body, wholeBody, {unpickable: true, color: [255, 255, 255, 1*255]}),
      this.getSceneNode(organs, wholeBody, {_lighting: 'pbr', color: [255, 0, 0, 0.8*255]}),
      this.getSceneNode(getSpatialEntity(this.db.store, ccf.x('VHRightKidney').id), wholeBody, {color: [255, 0, 0, 0.5*255]}),
      this.getSceneNode(getSpatialEntity(this.db.store, ccf.x('VHLeftKidney').id), wholeBody, {color: [0, 0, 255, 0.5*255]}),
      this.getSceneNode(getSpatialEntity(this.db.store, ccf.x('VHSpleenCC1').id), wholeBody, {color: [0, 255, 0, 0.5*255]}),
      this.getSceneNode(getSpatialEntity(this.db.store, ccf.x('VHSpleenCC2').id), wholeBody, {color: [0, 255, 0, 0.5*255]}),
      this.getSceneNode(getSpatialEntity(this.db.store, ccf.x('VHSpleenCC3').id), wholeBody, {color: [0, 255, 0, 0.5*255]})
    ].filter(s => s !== undefined) as SpatialSceneNode[];
  }

  getSceneNode(source: SpatialEntity, target: SpatialEntity, nodeAttrs: Partial<SpatialSceneNode> = {}): SpatialSceneNode | undefined {
    const has3dObject = source.object && source.object.file_format?.startsWith('model/gltf');
    const sourceID = has3dObject && source.object ? source.object['@id'] : source['@id'];
    let transform = this.db.graph.getTransformationMatrix(sourceID, target['@id']);
    if (transform) {
      if (has3dObject) {
        transform = new Matrix4().rotateX(toRadians(90)).multiplyLeft(transform);
      } else {
        // Scale visible bounding boxes to the desired dimensions
        let factor: number;
        switch (source.dimension_units) {
          case 'centimeter':
            factor = 1 / 100;
            break;
          case 'millimeter':
            factor = 1 / 1000;
            break;
          case 'meter':
          default:
            factor = 1;
            break;
        }
        const scale = [source.x_dimension, source.y_dimension, source.z_dimension].map(dim => dim * factor / 2);
        transform.scale(scale);
      }
      return {
        '@id': source['@id'], type: 'SpatialSceneNode',
        scenegraph: has3dObject ? source.object?.file : undefined,
        transformMatrix: transform,
        tooltip: source.label,
        ...nodeAttrs
      } as SpatialSceneNode;
    } else {
      return undefined;
    }
  }

  getScene(filter?: Filter): SpatialSceneNode[] {
    const wholeBody = getSpatialEntity(this.db.store, ccf.spatial.Body.id);
    return [
      ...this.getReferenceSceneNodes(filter),
      ...this.db.getSpatialEntities(filter).map((entity) =>
        this.getSceneNode(entity, wholeBody, {color: [255, 255, 255, 0.9*255]})
      )
    ].filter(s => s !== undefined) as SpatialSceneNode[];
  }
}
