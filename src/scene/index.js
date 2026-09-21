import { mergeScenes } from './build';
import { careerScene } from './chapters/career';
import { phoenixScene } from './chapters/phoenix';
import { closingScene } from './chapters/closing';

/**
 * The whole world, assembled once at module load. mergeScenes throws on a
 * duplicate node id or an edge pointing at a node that does not exist, so a
 * broken scene fails at import rather than silently dropping geometry.
 */
export const scene = mergeScenes([careerScene, phoenixScene, closingScene]);

export const sceneStats = {
  nodes: scene.nodes.length,
  edges: scene.edges.length,
  fields: scene.fields.length,
};
