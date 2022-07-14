// Import necessary dependencies
import * as utils from '@dcl/ecs-scene-utils'
import { Elevator } from './elevator'

// Instantiate building
const building = new Entity()
building.addComponent(new Transform({
  position: new Vector3(31.2, 0, 16)
}))
// Add glb bulding to sdk entity
building.addComponent(new GLTFShape("models/LP_2022_1_22__combine_take3_.glb"))
//adds the building entity into the "game engine", this is so DCL sees it
engine.addEntity(building)



// create ground shape from glb file
const ground = new GLTFShape("models/ground/FloorBaseGrass_01.glb")
ground.withCollisions = true
ground.isPointerBlocker = true
ground.visible = true
// Instantiate parcel one ground
const p1 = new Entity()
p1.addComponent(ground)
p1.addComponent(new Transform({
    position: new Vector3(8, 0, 8)
}))
// Add parcel one ground to scene
engine.addEntity(p1)
// Instantiate parcel two ground
const p2 = new Entity()
p2.addComponent(ground)
p2.addComponent(new Transform({
    position: new Vector3(24, 0, 8)
}))
// Add parcel two ground to scene
engine.addEntity(p2)


// Create elevator material
const elevatorMaterial = new Material()
elevatorMaterial.albedoColor = new Color3(1, 3, 6)
// Instantiate elevator
const centerElevator = new Elevator(
    new CylinderShape(),
    new Transform({
        position: new Vector3(16.75, 0, 7.75),
        scale: new Vector3(1, 0.2, 1)
    }),
    new utils.TriggerBoxShape(
        new Vector3(1.5, 2, 1.5),
        new Vector3(0, 1.75, 0)
    )
)
centerElevator.addComponent(elevatorMaterial)
engine.addEntity(centerElevator)


// Add music to scene
const clip = new AudioClip("sounds/Goldberg_Variations_BWV_988_05_Variatio_4_a_1_Clav.mp3")
const music = new AudioSource(clip)
centerElevator.addComponent(music)
music.volume = 0.25
music.playing = true
music.loop = true


// Initiate strobe material A
const AMaterial = new Material()
const strobeGreen = new Color3(2, 10, 2)
AMaterial.albedoColor = strobeGreen
// Initiate strobe material B
const BMaterial = new Material()
const strobePink = new Color3(15, 2, 10)
BMaterial.albedoColor = strobePink
// Initiate strobe material C
const CMaterial = new Material()
const strobeBlue = new Color3(2, 5, 10)
CMaterial.albedoColor = strobeBlue
// Add system for changing color of strobes
let index = 0
export class StrobeColors implements ISystem {
    update(dt: number) {
        if (index < 10) {
            AMaterial.albedoColor = strobeGreen
            BMaterial.albedoColor = strobePink
            CMaterial.albedoColor = strobeBlue
            index++
        } else if (index < 20) {
            AMaterial.albedoColor = strobePink
            BMaterial.albedoColor = strobeBlue
            CMaterial.albedoColor = strobeGreen
            index++
        } else if (index < 30) {
            AMaterial.albedoColor = strobeBlue
            BMaterial.albedoColor = strobeGreen
            CMaterial.albedoColor = strobePink
            index++
            if (index == 30) {
                index = 0
            }
        }
    }
}
engine.addSystem(new StrobeColors())


// Instantiate strobes
for (let i = 0; i < 12; i++) {
    let strobe = new Entity()
    let radians = ((i * 30) * Math.PI) / 180.0
    let strobeShape = new BoxShape()
    strobeShape.withCollisions = false
    strobe.addComponent(strobeShape)
    strobe.addComponent(new Transform({
        position: new Vector3((2.9 * Math.cos(radians)) + 17.9, 1.7, (3 * Math.sin(radians)) + 8.1),
        scale: new Vector3(.2, 3.5, .2)
        })
    )
    if (i == 3 || i == 9){
        strobe.addComponent(AMaterial)
    } else if (i % 2 == 0) {
        strobe.addComponent(BMaterial)
    } else {
        strobe.addComponent(CMaterial)
    }
    engine.addEntity(strobe)
}
