import { MeshPhongMaterial, Mesh, BoxGeometry, SphereGeometry, CapsuleGeometry, CylinderGeometry } from 'three';
import { createMeshForShape } from './createMeshForShape.js';
import { getSoftBodyMesh } from './getSoftBodyMesh.js';

/**
 * Creates a Three.js mesh based on the Jolt body shape type.
 * @param {Object} body - The Jolt body
 * @param {number} color - color for the mesh
 * @param {Object} Jolt - The Jolt WASM/JS object
 * @return {THREE.Mesh} - The constructed mesh
 */
export function getThreeObjectForBody(body, color, Jolt) {
  const material = new MeshPhongMaterial({ color });
  const shape = body.GetShape();
  let threeObject;

  switch (shape.GetSubType()) {
    case Jolt.EShapeSubType_Box: {
      const boxShape = Jolt.castObject(shape, Jolt.BoxShape);
      const halfExtent = boxShape.GetHalfExtent();
      const sizeX = halfExtent.GetX() * 2;
      const sizeY = halfExtent.GetY() * 2;
      const sizeZ = halfExtent.GetZ() * 2;
      threeObject = new Mesh(new BoxGeometry(sizeX, sizeY, sizeZ), material);
      break;
    }
    case Jolt.EShapeSubType_Sphere: {
      const sphereShape = Jolt.castObject(shape, Jolt.SphereShape);
      const radius = sphereShape.GetRadius();
      threeObject = new Mesh(new SphereGeometry(radius, 32, 32), material);
      break;
    }
    case Jolt.EShapeSubType_Capsule: {
      const capsuleShape = Jolt.castObject(shape, Jolt.CapsuleShape);
      const capRadius = capsuleShape.GetRadius();
      const capHeight = capsuleShape.GetHalfHeightOfCylinder() * 2;
      threeObject = new Mesh(new CapsuleGeometry(capRadius, capHeight, 20, 10), material);
      break;
    }
    case Jolt.EShapeSubType_Cylinder: {
      const cylinderShape = Jolt.castObject(shape, Jolt.CylinderShape);
      const cRadius = cylinderShape.GetRadius();
      const cHeight = cylinderShape.GetHalfHeight() * 2;
      threeObject = new Mesh(new CylinderGeometry(cRadius, cRadius, cHeight, 20, 1), material);
      break;
    }
    default: {
      if (body.GetBodyType() === Jolt.EBodyType_SoftBody) {
        threeObject = getSoftBodyMesh(body, material, Jolt);
      } else {
        threeObject = new Mesh(createMeshForShape(shape, Jolt), material);
      }
    }
  }

  // Set position and rotation
  threeObject.position.set(
    body.GetPosition().GetX(),
    body.GetPosition().GetY(),
    body.GetPosition().GetZ()
  );
  threeObject.quaternion.set(
    body.GetRotation().GetX(),
    body.GetRotation().GetY(),
    body.GetRotation().GetZ(),
    body.GetRotation().GetW()
  );

  return threeObject;
} 