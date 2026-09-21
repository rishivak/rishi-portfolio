import { SpecPipeline } from './SpecPipeline';
import { DocumentFlow } from './DocumentFlow';
import { QueryPath } from './QueryPath';
import { EdiBridge } from './EdiBridge';
import { PulseFlow } from './PulseFlow';

/** Resolved by the `diagram` key on each entry in src/data/systems.js. */
export const diagrams = { SpecPipeline, DocumentFlow, QueryPath, EdiBridge, PulseFlow };
