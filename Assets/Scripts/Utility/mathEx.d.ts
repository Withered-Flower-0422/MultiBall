import { Float2, Float3, Quaternion } from "gameApi";
export declare namespace mathEx {
    const PI: number;
    const TWO_PI: number;
    const RAD_TO_DEG: number;
    const DEG_TO_RAD: number;
    /**
     * Clamps a value between a minimum and maximum value.
     * @param value - The value to clamp.
     * @param min - The minimum value.
     * @param max - The maximum value.
     * @returns The clamped value.
     */
    const clamp: (value: number, min: number, max: number) => number;
    /**
     * Converts an angle from degrees to radians.
     * @param degrees - The angle in degrees.
     * @returns The angle in radians.
     */
    const degToRad: (degrees: number) => number;
    /**
     * Converts an angle from radians to degrees.
     * @param radians - The angle in radians.
     * @returns The angle in degrees.
     */
    const radToDeg: (radians: number) => number;
    /**
     * Normalizes an angle to the range [0, 360).
     * E.g., 370 degrees -> 10 degrees, -10 degrees -> 350 degrees.
     * @param degrees - An angle in degrees.
     * @returns The normalized angle.
     */
    const normalizeDeg: (degrees: number) => number;
    /**
     * Normalizes an angle to the range [0, 2π).
     * @param radians - An angle in radians.
     * @returns The normalized angle.
     */
    const normalizeRad: (radians: number) => number;
    /**
     * Calculates the shortest difference between two angles in degrees.
     * The result is in the range [-180, 180]. A positive value means counter-clockwise from a to b.
     * @param a - The starting angle in degrees.
     * @param b - The target angle in degrees.
     * @returns The shortest angular difference.
     */
    const shortestAngleDiffDeg: (a: number, b: number) => number;
    /**
     * Calculates the shortest difference between two angles in radians.
     * The result is in the range [-π, π].
     * @param a - The starting angle in radians.
     * @param b - The target angle in radians.
     * @returns The shortest angular difference.
     */
    const shortestAngleDiffRad: (a: number, b: number) => number;
    /**
     * Calculates the angle of a 2D vector.
     * @param value - The 2D vector.
     * @returns The angle of the vector in radians.
     */
    const angleFloat2: (value: Float2) => number;
    /**
     * Adds one or more vectors together.
     * @param values - The vectors to add.
     * @returns The resulting vector.
     */
    const addFloat3: (...values: Float3[]) => Float3;
    /**
     * Subtracts one vector from one or more vectors.
     * @param a - The vector to subtract from.
     * @param b - The vectors to subtract.
     * @returns The resulting vector.
     */
    const subFloat3: (a: Float3, ...b: Float3[]) => Float3;
    /**
     * Scales a vector by scalar values.
     * @param value - The vector.
     * @param scalars - The scalar values.
     * @returns The scaled vector.
     */
    const scaleFloat3: (value: Float3, ...scalars: number[]) => Float3;
    /**
     * Calculates the inverse of a quaternion. For a unit quaternion, the inverse is its conjugate.
     * @param q - The quaternion.
     * @returns The inverted quaternion.
     */
    const invertQuaternion: (q: Quaternion) => Quaternion;
    /**
     * Multiplies a list of quaternions in order, from right to left.
     * Note: The order is important. a * b applies rotation b first, then rotation a.
     * @param q - The first quaternion.
     * @param qs - The rest quaternions.
     * @returns The resulting quaternion.
     */
    const mulQuaternion: (q: Quaternion, ...qs: Quaternion[]) => Quaternion;
    /**
     * Calculates the dot product of two quaternions.
     * @param a - The first quaternion.
     * @param b - The second quaternion.
     * @returns The dot product of two quaternions.
     */
    const dotQuaternion: (a: Quaternion, b: Quaternion) => number;
    /**
     * Calculates the negation of a quaternion.
     * @param q - The quaternion.
     * @returns The negated quaternion.
     */
    const negQuaternion: (q: Quaternion) => Quaternion;
    /**
     * Calculates the length of a quaternion.
     * @param q - The quaternion.
     * @returns The length of a quaternion.
     */
    const lengthQuaternion: (q: Quaternion) => number;
    /**
     * Creates a quaternion from an axis and an angle.
     * @param axis - The rotation axis.
     * @param angle - The angle of rotation in radians.
     * @returns The resulting quaternion.
     */
    const axisAngleToQuaternion: (axis: Float3, angle: number) => Quaternion;
    /**
     * Rotates a 3D vector using a quaternion.
     * @param v - The vector to rotate.
     * @param q - The quaternion representing the rotation.
     * @returns The new, rotated vector.
     */
    const transFloat3WithQuat: (v: Float3, q: Quaternion) => Float3;
    /**
     * Performs a spherical linear interpolation (Slerp) between two quaternions.
     * @param a - The starting quaternion.
     * @param b - The ending quaternion.
     * @param t - The interpolation factor (from 0.0 to 1.0).
     * @returns The interpolated quaternion.
     */
    const slerpQuaternion: (a: Quaternion, b: Quaternion, t: number) => Quaternion;
    /**
     * Calculates the angular velocity required to reach a unit quaternion from the current quaternion.
     * @param q - The current quaternion.
     * @param kp - The proportional gain, defaults to `8`.
     * @returns The required angular velocity.
     */
    const getAngularVelocityToUnit: (q: Quaternion, kp?: number) => Float3;
    /**
     * Calculates the angular velocity required to reach a target quaternion from the current quaternion.
     * @param a - The current quaternion.
     * @param b - The target quaternion, defaults to the unit quaternion.
     * @param kp - The proportional gain, defaults to `8`.
     * @returns The required angular velocity.
     */
    const getAngularVelocityToTarget: (a: Quaternion, b?: Quaternion | undefined, kp?: number | undefined) => Float3;
    /**
     * Creates a pure quaternion from a 3D vector.
     * A pure quaternion has a scalar part (w) of 0.
     * @param v - The 3D vector.
     * @returns The resulting pure quaternion.
     */
    const float3ToPureQuaternion: (v: Float3) => Quaternion;
    /**
     * Extracts the rotation axis and angle from a quaternion.
     * @param q - The quaternion.
     * @returns An object containing the axis and angle in radians. If q.w is close to ±1, the angle is 0 and the axis defaults to (0, 1, 0).
     */
    const quaternionToAxisAngle: (q: Quaternion) => {
        axis: Float3;
        angle: number;
    };
    /**
     * Calculates the final position of a point rotated around an arbitrary axis.
     * @param currentPos - The initial point to rotate.
     * @param pivot - The pivot point for the rotation.
     * @param axis - The axis of rotation.
     * @param angle - The angle of rotation in radians.
     * @returns The final coordinates of the point after rotation.
     */
    const rotPosAroundAxis: (currentPos: Float3, pivot: Float3, axis: Float3, angle: number) => Float3;
    /**
     * Calculates the final quaternion of a rotation around an arbitrary axis.
     * @param currentQuat - The initial quaternion to rotate.
     * @param axis - The axis of rotation.
     * @param angle - The angle of rotation in radians.
     * @returns The final quaternion after rotation.
     */
    const rotQuatAroundAxis: (currentQuat: Quaternion, axis: Float3, angle: number) => Quaternion;
    /**
     * Gets the quaternion that rotates vec1 to vec2.
     * @param v1 - The first vector.
     * @param v2 - The second vector.
     * @returns The quaternion that rotates v1 to v2.
     */
    const getQuatFromAxes: (v1: Float3, v2: Float3) => Quaternion;
    /**
     * Gets the linear and angular acceleration of an item due to a force at a point.
     * @param itemPos - The position of the item.
     * @param itemQuat - The rotation quaternion of the item.
     * @param forcePos - The position of the force.
     * @param forceVec - The vector of the force.
     * @param mass - The mass of the item.
     * @param linearKp - The proportional gain for linear acceleration.
     * @param angularKp - The proportional gain for angular acceleration.
     * @returns The linear and angular acceleration of the item due to the force.
     */
    const getAccelerationByForceAtPoint: (itemPos: Float3, itemQuat: Quaternion, forcePos: Float3, forceVec: Float3, mass: number, linearKp: number, angularKp: number) => {
        linear: Float3;
        angular: Float3;
    };
    /**
     * Gets the linear and angular velocity of an item after applying a force at a point.
     * @param itemPos - The position of the item.
     * @param itemQuat - The rotation quaternion of the item.
     * @param forcePos - The position of the force.
     * @param forceVec - The vector of the force.
     * @param originalLinearVel - The original linear velocity of the item.
     * @param originalAngularVel - The original angular velocity of the item.
     * @param mass - The mass of the item.
     * @param linearKp - The proportional gain for linear acceleration.
     * @param angularKp - The proportional gain for angular acceleration.
     * @returns The linear and angular velocity of the item after applying the force.
     */
    const getVelocityByForceAtPoint: (itemPos: Float3, itemQuat: Quaternion, forcePos: Float3, forceVec: Float3, originalLinearVel: Float3, originalAngularVel: Float3, mass: number, linearKp: number, angularKp: number) => {
        linear: Float3;
        angular: Float3;
    };
}
export default mathEx;
