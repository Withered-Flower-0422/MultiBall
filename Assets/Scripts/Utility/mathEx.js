import { math, Float3, Quaternion } from "gameApi";
export { mathEx };
var mathEx;
(function (mathEx) {
    mathEx.PI = Math.PI;
    mathEx.TWO_PI = Math.PI * 2;
    mathEx.RAD_TO_DEG = 180 / Math.PI;
    mathEx.DEG_TO_RAD = Math.PI / 180;
    /**
     * Clamps a value between a minimum and maximum value.
     * @param value - The value to clamp.
     * @param min - The minimum value.
     * @param max - The maximum value.
     * @returns The clamped value.
     */
    mathEx.clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    /**
     * Converts an angle from degrees to radians.
     * @param degrees - The angle in degrees.
     * @returns The angle in radians.
     */
    mathEx.degToRad = (degrees) => degrees * mathEx.DEG_TO_RAD;
    /**
     * Converts an angle from radians to degrees.
     * @param radians - The angle in radians.
     * @returns The angle in degrees.
     */
    mathEx.radToDeg = (radians) => radians * mathEx.RAD_TO_DEG;
    /**
     * Normalizes an angle to the range [0, 360).
     * E.g., 370 degrees -> 10 degrees, -10 degrees -> 350 degrees.
     * @param degrees - An angle in degrees.
     * @returns The normalized angle.
     */
    mathEx.normalizeDeg = (degrees) => ((degrees % 360) + 360) % 360;
    /**
     * Normalizes an angle to the range [0, 2π).
     * @param radians - An angle in radians.
     * @returns The normalized angle.
     */
    mathEx.normalizeRad = (radians) => ((radians % mathEx.TWO_PI) + mathEx.TWO_PI) % mathEx.TWO_PI;
    /**
     * Calculates the shortest difference between two angles in degrees.
     * The result is in the range [-180, 180]. A positive value means counter-clockwise from a to b.
     * @param a - The starting angle in degrees.
     * @param b - The target angle in degrees.
     * @returns The shortest angular difference.
     */
    mathEx.shortestAngleDiffDeg = (a, b) => {
        const diff = mathEx.normalizeDeg(b - a);
        return diff > 180 ? diff - 360 : diff;
    };
    /**
     * Calculates the shortest difference between two angles in radians.
     * The result is in the range [-π, π].
     * @param a - The starting angle in radians.
     * @param b - The target angle in radians.
     * @returns The shortest angular difference.
     */
    mathEx.shortestAngleDiffRad = (a, b) => {
        const diff = mathEx.normalizeRad(b - a);
        return diff > mathEx.PI ? diff - mathEx.TWO_PI : diff;
    };
    /**
     * Calculates the angle of a 2D vector.
     * @param value - The 2D vector.
     * @returns The angle of the vector in radians.
     */
    mathEx.angleFloat2 = (value) => Math.atan2(value.y, value.x);
    /**
     * Adds one or more vectors together.
     * @param values - The vectors to add.
     * @returns The resulting vector.
     */
    mathEx.addFloat3 = (...values) => {
        let x = 0;
        let y = 0;
        let z = 0;
        for (const v of values) {
            x += v.x;
            y += v.y;
            z += v.z;
        }
        return new Float3(x, y, z);
    };
    /**
     * Subtracts one vector from one or more vectors.
     * @param a - The vector to subtract from.
     * @param b - The vectors to subtract.
     * @returns The resulting vector.
     */
    mathEx.subFloat3 = (a, ...b) => {
        let { x, y, z } = a;
        for (const v of b) {
            x -= v.x;
            y -= v.y;
            z -= v.z;
        }
        return new Float3(x, y, z);
    };
    /**
     * Scales a vector by scalar values.
     * @param value - The vector.
     * @param scalars - The scalar values.
     * @returns The scaled vector.
     */
    mathEx.scaleFloat3 = (value, ...scalars) => {
        let { x, y, z } = value;
        for (const s of scalars) {
            x *= s;
            y *= s;
            z *= s;
        }
        return new Float3(x, y, z);
    };
    /**
     * Calculates the inverse of a quaternion. For a unit quaternion, the inverse is its conjugate.
     * @param q - The quaternion.
     * @returns The inverted quaternion.
     */
    mathEx.invertQuaternion = (q) => new Quaternion(-q.x, -q.y, -q.z, q.w);
    const _mulQuaternion = (a, b) => new Quaternion(a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y, a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z, a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x, a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z);
    /**
     * Multiplies a list of quaternions in order, from right to left.
     * Note: The order is important. a * b applies rotation b first, then rotation a.
     * @param q - The first quaternion.
     * @param qs - The rest quaternions.
     * @returns The resulting quaternion.
     */
    mathEx.mulQuaternion = (q, ...qs) => qs.reduce((acc, q) => _mulQuaternion(acc, q), q);
    /**
     * Calculates the dot product of two quaternions.
     * @param a - The first quaternion.
     * @param b - The second quaternion.
     * @returns The dot product of two quaternions.
     */
    mathEx.dotQuaternion = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    /**
     * Calculates the negation of a quaternion.
     * @param q - The quaternion.
     * @returns The negated quaternion.
     */
    mathEx.negQuaternion = (q) => new Quaternion(-q.x, -q.y, -q.z, -q.w);
    /**
     * Calculates the length of a quaternion.
     * @param q - The quaternion.
     * @returns The length of a quaternion.
     */
    mathEx.lengthQuaternion = (q) => Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    /**
     * Creates a quaternion from an axis and an angle.
     * @param axis - The rotation axis.
     * @param angle - The angle of rotation in radians.
     * @returns The resulting quaternion.
     */
    mathEx.axisAngleToQuaternion = (axis, angle) => {
        const { x, y, z } = math.normalizeFloat3(axis);
        const halfAngle = angle / 2;
        const s = Math.sin(halfAngle);
        return new Quaternion(x * s, y * s, z * s, Math.cos(halfAngle));
    };
    /**
     * Rotates a 3D vector using a quaternion.
     * @param v - The vector to rotate.
     * @param q - The quaternion representing the rotation.
     * @returns The new, rotated vector.
     */
    mathEx.transFloat3WithQuat = (v, q) => mathEx.quaternionToAxisAngle(mathEx.mulQuaternion(q, mathEx.float3ToPureQuaternion(v), mathEx.invertQuaternion(q))).axis;
    /**
     * Performs a spherical linear interpolation (Slerp) between two quaternions.
     * @param a - The starting quaternion.
     * @param b - The ending quaternion.
     * @param t - The interpolation factor (from 0.0 to 1.0).
     * @returns The interpolated quaternion.
     */
    mathEx.slerpQuaternion = (a, b, t) => {
        let { x: ax, y: ay, z: az, w: aw } = a;
        let { x: bx, y: by, z: bz, w: bw } = b;
        t = mathEx.clamp(t, 0, 1);
        let cosTheta = ax * bx + ay * by + az * bz + aw * bw;
        if (cosTheta < 0) {
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
            cosTheta = -cosTheta;
        }
        if (cosTheta > 1 - 1e-9) {
            const rx = ax + t * (bx - ax);
            const ry = ay + t * (by - ay);
            const rz = az + t * (bz - az);
            const rw = aw + t * (bw - aw);
            const len = Math.sqrt(rx * rx + ry * ry + rz * rz + rw * rw);
            return new Quaternion(rx / len, ry / len, rz / len, rw / len);
        }
        const theta = Math.acos(cosTheta);
        const sinTheta = Math.sin(theta);
        const scaleA = Math.sin((1 - t) * theta) / sinTheta;
        const scaleB = Math.sin(t * theta) / sinTheta;
        return new Quaternion(scaleA * ax + scaleB * bx, scaleA * ay + scaleB * by, scaleA * az + scaleB * bz, scaleA * aw + scaleB * bw);
    };
    /**
     * Calculates the angular velocity required to reach a unit quaternion from the current quaternion.
     * @param q - The current quaternion.
     * @param kp - The proportional gain, defaults to `8`.
     * @returns The required angular velocity.
     */
    mathEx.getAngularVelocityToUnit = (q, kp = 8) => {
        let { x, y, z, w } = q;
        const sinHalfAngle = Math.sqrt(1 - w * w);
        if (sinHalfAngle < 1e-9)
            return new Float3(0, 0, 0);
        if (w < 0) {
            w = -w;
        }
        else {
            x = -x;
            y = -y;
            z = -z;
        }
        const ratio = (kp * Math.acos(w)) / sinHalfAngle;
        return new Float3(ratio * x, ratio * y, ratio * z);
    };
    /**
     * Calculates the angular velocity required to reach a target quaternion from the current quaternion.
     * @param a - The current quaternion.
     * @param b - The target quaternion, defaults to the unit quaternion.
     * @param kp - The proportional gain, defaults to `8`.
     * @returns The required angular velocity.
     */
    mathEx.getAngularVelocityToTarget = (a, b, kp) => {
        let { x, y, z, w } = (b ??= new Quaternion(0, 0, 0, 1));
        kp ??= 8;
        if (x === 0 && y === 0 && z === 0 && w === 1)
            return mathEx.getAngularVelocityToUnit(a, kp);
        ({ x, y, z, w } = mathEx.mulQuaternion(mathEx.invertQuaternion(a), b));
        const sinHalfAngle = Math.sqrt(1 - w * w);
        if (sinHalfAngle < 1e-9)
            return new Float3(0, 0, 0);
        if (w < 0) {
            x = -x;
            y = -y;
            z = -z;
            w = -w;
        }
        const ratio = (kp * Math.acos(w)) / sinHalfAngle;
        return new Float3(ratio * x, ratio * y, ratio * z);
    };
    /**
     * Creates a pure quaternion from a 3D vector.
     * A pure quaternion has a scalar part (w) of 0.
     * @param v - The 3D vector.
     * @returns The resulting pure quaternion.
     */
    mathEx.float3ToPureQuaternion = (v) => new Quaternion(v.x, v.y, v.z, 0);
    /**
     * Extracts the rotation axis and angle from a quaternion.
     * @param q - The quaternion.
     * @returns An object containing the axis and angle in radians. If q.w is close to ±1, the angle is 0 and the axis defaults to (0, 1, 0).
     */
    mathEx.quaternionToAxisAngle = (q) => {
        const { x, y, z, w } = q;
        const s = Math.sqrt(1 - w * w);
        if (s < 1e-9)
            return { axis: new Float3(0, 1, 0), angle: 0 };
        return {
            axis: new Float3(x / s, y / s, z / s),
            angle: 2 * Math.acos(w),
        };
    };
    /**
     * Calculates the final position of a point rotated around an arbitrary axis.
     * @param currentPos - The initial point to rotate.
     * @param pivot - The pivot point for the rotation.
     * @param axis - The axis of rotation.
     * @param angle - The angle of rotation in radians.
     * @returns The final coordinates of the point after rotation.
     */
    mathEx.rotPosAroundAxis = (currentPos, pivot, axis, angle) => mathEx.addFloat3(pivot, mathEx.transFloat3WithQuat(mathEx.subFloat3(currentPos, pivot), mathEx.axisAngleToQuaternion(axis, angle)));
    /**
     * Calculates the final quaternion of a rotation around an arbitrary axis.
     * @param currentQuat - The initial quaternion to rotate.
     * @param axis - The axis of rotation.
     * @param angle - The angle of rotation in radians.
     * @returns The final quaternion after rotation.
     */
    mathEx.rotQuatAroundAxis = (currentQuat, axis, angle) => mathEx.mulQuaternion(mathEx.axisAngleToQuaternion(axis, angle), currentQuat);
    /**
     * Gets the quaternion that rotates vec1 to vec2.
     * @param v1 - The first vector.
     * @param v2 - The second vector.
     * @returns The quaternion that rotates v1 to v2.
     */
    mathEx.getQuatFromAxes = (v1, v2) => {
        const u1 = math.normalizeFloat3(v1);
        const u2 = math.normalizeFloat3(v2);
        const dot = math.dotProductFloat3(u1, u2);
        if (dot > 1 - 1e-9)
            return new Quaternion(0, 0, 0, 1);
        if (dot < -1 + 1e-9) {
            let axis = math.crossProductFloat3(u1, new Float3(1, 0, 0));
            if (math.lengthFloat3(axis) < 1e-9)
                axis = math.crossProductFloat3(u1, new Float3(0, 1, 0));
            const { x, y, z } = math.normalizeFloat3(axis);
            return new Quaternion(x, y, z, 0);
        }
        const { x, y, z } = math.crossProductFloat3(u1, u2);
        return math.normalizeQuaternion(new Quaternion(x, y, z, 1 + dot));
    };
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
    mathEx.getAccelerationByForceAtPoint = (itemPos, itemQuat, forcePos, forceVec, mass, linearKp, angularKp) => ({
        linear: mathEx.scaleFloat3(forceVec, linearKp / mass),
        angular: mathEx.scaleFloat3(mathEx.transFloat3WithQuat(math.crossProductFloat3(mathEx.subFloat3(forcePos, itemPos), forceVec), mathEx.invertQuaternion(itemQuat)), angularKp / mass),
    });
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
    mathEx.getVelocityByForceAtPoint = (itemPos, itemQuat, forcePos, forceVec, originalLinearVel, originalAngularVel, mass, linearKp, angularKp) => {
        const { linear, angular } = mathEx.getAccelerationByForceAtPoint(itemPos, itemQuat, forcePos, forceVec, mass, linearKp, angularKp);
        return {
            linear: mathEx.addFloat3(originalLinearVel, linear),
            angular: mathEx.addFloat3(originalAngularVel, angular),
        };
    };
})(mathEx || (mathEx = {}));
export default mathEx;
