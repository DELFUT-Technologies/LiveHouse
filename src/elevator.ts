// Import required dependencies
import * as utils from "@dcl/ecs-scene-utils";

// Initiate first and third floor vector
let firstFloor = new Vector3(16.75, 0, 7.75)
let secondFloor = new Vector3(16.75, 3.4, 7.75)
let thirdFloor = new Vector3(16.75, 7, 7.75)
let UP = true
let start:Vector3 = firstFloor
let end:Vector3 = secondFloor

// Create new class Elevator from Entity
export class Elevator extends Entity {
    constructor(
        model: BoxShape,
        transform: Transform,
        triggerShape: utils.TriggerBoxShape
    ) {
        super()
        engine.addEntity(this)
        this.addComponent(model)
        this.addComponent(transform)

        // Create trigger for entity
        this.addComponent(
            new utils.TriggerComponent(triggerShape, {
                onCameraEnter: () => {
                    this.getComponent(utils.ToggleComponent).toggle()
                },
                onCameraExit: () => {
                    this.getComponent(utils.ToggleComponent).toggle()
                },
            })
        )

        // Create toggle for entity
        this.addComponent(
            new utils.ToggleComponent(utils.ToggleState.Off, (value) => {
                if (value == utils.ToggleState.On) {
                    start = this.getComponent(Transform).position
                    if (start.equals(firstFloor)) {
                        end = secondFloor
                        UP = true
                    } else if (start.equals(secondFloor)) {
                        end = UP ? thirdFloor : firstFloor
                    } else if (start.equals(thirdFloor)) {
                        end = secondFloor
                        UP = false
                    }
                    this.addComponentOrReplace(
                        new utils.MoveTransformComponent(start, end, 2)
                    )}
                }
            )
        )
    }
}
