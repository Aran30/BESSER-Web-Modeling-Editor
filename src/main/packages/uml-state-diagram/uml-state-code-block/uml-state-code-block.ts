import { DeepPartial } from 'redux';
import { StateElementType, StateRelationshipType } from '..';
import { ILayer } from '../../../services/layouter/layer';
import { ILayoutable } from '../../../services/layouter/layoutable';
import { IUMLElement, UMLElement } from '../../../services/uml-element/uml-element';
import { UMLElementFeatures } from '../../../services/uml-element/uml-element-features';
import { assign } from '../../../utils/fx/assign';
import { IBoundary } from '../../../utils/geometry/boundary';
import { UMLElementType } from '../../uml-element-type';

export interface IUMLStateCodeBlock extends IUMLElement {
  code: string;
  language: string;
}

export class UMLStateCodeBlock extends UMLElement implements IUMLStateCodeBlock {
  static supportedRelationships = [StateRelationshipType.StateTransition];
  static features: UMLElementFeatures = { ...UMLElement.features, resizable: true };
  
  type: UMLElementType = StateElementType.StateCodeBlock;
  code: string = '';
  language: string = 'python';
  
  bounds: IBoundary = { 
    ...this.bounds, 
    width: 200, 
    height: 150 
  };

  constructor(values?: DeepPartial<IUMLStateCodeBlock>) {
    super(values);
    assign<IUMLStateCodeBlock>(this, values);
    if (values?.code) {
      this.code = values.code;
    }
    // Always use Python regardless of what's provided
    this.language = 'python';
  }

  render(canvas: ILayer): ILayoutable[] {
    // Enforce minimum dimensions for readability
    this.bounds.width = Math.max(this.bounds.width, 150);
    this.bounds.height = Math.max(this.bounds.height, 100);
    return [this];
  }

  serialize(): any {
    const base = super.serialize();
    return {
      ...base,
      type: this.type,
      code: this.code,
      language: this.language
    };
  }
}
