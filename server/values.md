# node2esp.json

### esc
* type: ```float[6]```
* value range: ```0.0```(min) - ```1.0```(max)
* default value: ```0.0```
* **to control 6 thrusters.**
<br>

### servo
* type: ```int[4]```
* value range:
    ```-1```(counter-clockwise),
    ```0```(stop),
    ```1```(clockwise)
* default value: ```0```
* **to control 4 servos (2 for each gripper).**
<br>

### lights
* type: ```int[2]```
* value range:
    ```0```(off),
    ```1```(on)
* **to control 2 waterproof lights.**
<br>
<br>

# esp2node.json

### depth
* type: ```float```
* value range: ```NA```
* default value: ```0```
* **to dispaly the depth of the ROV.**
<br>

### mpu
* type: ```object{flaot[3], float[3], float}```
* value range: ```NA```
* default value: ```{[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 0.0}```
* **to dispaly the acceleration, gyroscope and internal temperature of the ROV.**
<br>
