import { Point } from '../../utils/geometry/point';
import { Direction } from '../uml-element/uml-element-port';
import { IUMLRelationship } from './uml-relationship';

/**
 * Calcule la position exacte du port central d'une relation
 * Cette fonction est plus précise que le simple centre du rectangle englobant
 */
export function getRelationshipCenterPoint(relationship: IUMLRelationship): Point {
  if (!relationship || !relationship.path || relationship.path.length < 2) {
    return new Point(
      relationship?.bounds?.width ? relationship.bounds.width / 2 : 0,
      relationship?.bounds?.height ? relationship.bounds.height / 2 : 0
    );
  }
  
  // Pour un chemin à segments multiples, trouver un point milieu
  const middleIndex = Math.floor(relationship.path.length / 2);
  
  // Si on est à l'index 0, utiliser un point entre 0 et 1
  if (middleIndex === 0) {
    const startPoint = relationship.path[0];
    const endPoint = relationship.path[1];
    return new Point(
      startPoint.x + (endPoint.x - startPoint.x) / 2,
      startPoint.y + (endPoint.y - startPoint.y) / 2
    );
  }
  
  // Sinon utiliser le point milieu du segment
  const startPoint = relationship.path[middleIndex - 1];
  const endPoint = relationship.path[middleIndex];
  
  // Obtenir le point milieu du segment
  return new Point(
    startPoint.x + (endPoint.x - startPoint.x) / 2,
    startPoint.y + (endPoint.y - startPoint.y) / 2
  );
}

/**
 * Obtient tous les ports pour une relation, avec le port central correctement positionné
 */
export function getPortsForRelationship(relationship: IUMLRelationship): { [key in Direction]: Point } {
  if (!relationship || !relationship.bounds) {
    // Return default ports if relationship is invalid
    return Object.values(Direction).reduce((acc, dir) => {
      acc[dir] = new Point(0, 0);
      return acc;
    }, {} as { [key in Direction]: Point });
  }
  
  // Calculer le point central avec précision
  const centerPoint = getRelationshipCenterPoint(relationship);
  
  // Retourner le point central et les points standards
  return {
    [Direction.Up]: new Point(relationship.bounds.width / 2, 0),
    [Direction.Right]: new Point(relationship.bounds.width, relationship.bounds.height / 2),
    [Direction.Down]: new Point(relationship.bounds.width / 2, relationship.bounds.height),
    [Direction.Left]: new Point(0, relationship.bounds.height / 2),
    [Direction.Upright]: new Point(relationship.bounds.width, relationship.bounds.height / 4),
    [Direction.Downright]: new Point(relationship.bounds.width, (3 * relationship.bounds.height) / 4),
    [Direction.Upleft]: new Point(0, relationship.bounds.height / 4),
    [Direction.Downleft]: new Point(0, (3 * relationship.bounds.height) / 4),
    [Direction.Topright]: new Point((3 * relationship.bounds.width) / 4, 0),
    [Direction.Bottomright]: new Point((3 * relationship.bounds.width) / 4, relationship.bounds.height),
    [Direction.Topleft]: new Point(relationship.bounds.width / 4, 0),
    [Direction.Bottomleft]: new Point(relationship.bounds.width / 4, relationship.bounds.height),
    [Direction.Center]: centerPoint,
  };
}
