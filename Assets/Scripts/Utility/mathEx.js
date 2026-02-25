// @ts-nocheck
import { math, Float2, Float3, Quaternion } from "gameApi";
export let mathEx;
(function (_mathEx) {
  const PI = _mathEx.PI = Math.PI;
  const TWO_PI = _mathEx.TWO_PI = Math.PI * 2;
  const RAD_TO_DEG = _mathEx.RAD_TO_DEG = 180 / Math.PI;
  const DEG_TO_RAD = _mathEx.DEG_TO_RAD = Math.PI / 180;
  const clamp = _mathEx.clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const degToRad = _mathEx.degToRad = degrees => degrees * mathEx.DEG_TO_RAD;
  const radToDeg = _mathEx.radToDeg = radians => radians * mathEx.RAD_TO_DEG;
  const normalizeDeg = _mathEx.normalizeDeg = degrees => (degrees % 360 + 360) % 360;
  const normalizeRad = _mathEx.normalizeRad = radians => (radians % mathEx.TWO_PI + mathEx.TWO_PI) % mathEx.TWO_PI;
  const shortestAngleDiffDeg = _mathEx.shortestAngleDiffDeg = (a, b) => {
    const diff = mathEx.normalizeDeg(b - a);
    return diff > 180 ? diff - 360 : diff;
  };
  const shortestAngleDiffRad = _mathEx.shortestAngleDiffRad = (a, b) => {
    const diff = mathEx.normalizeRad(b - a);
    return diff > mathEx.PI ? diff - mathEx.TWO_PI : diff;
  };
  const angleFloat2 = _mathEx.angleFloat2 = value => Math.atan2(value.y, value.x);
  const lengthFloat2 = _mathEx.lengthFloat2 = value => Math.sqrt(value.x * value.x + value.y * value.y);
  const normalizeFloat2 = _mathEx.normalizeFloat2 = value => {
    const len = mathEx.lengthFloat2(value);
    return new Float2(value.x / len, value.y / len);
  };
  const scaleFloat2 = _mathEx.scaleFloat2 = function (value) {
    let {
      x,
      y
    } = value;
    for (var _len = arguments.length, scalars = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      scalars[_key - 1] = arguments[_key];
    }
    for (const s of scalars) {
      x *= s;
      y *= s;
    }
    return new Float2(x, y);
  };
  const rotateFloat2 = _mathEx.rotateFloat2 = (value, angle) => {
    const {
      x,
      y
    } = value;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Float2(x * cos - y * sin, x * sin + y * cos);
  };
  const addFloat3 = _mathEx.addFloat3 = function () {
    let x = 0;
    let y = 0;
    let z = 0;
    for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      values[_key2] = arguments[_key2];
    }
    for (const v of values) {
      x += v.x;
      y += v.y;
      z += v.z;
    }
    return new Float3(x, y, z);
  };
  const subFloat3 = _mathEx.subFloat3 = function (a) {
    let {
      x,
      y,
      z
    } = a;
    for (var _len3 = arguments.length, b = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      b[_key3 - 1] = arguments[_key3];
    }
    for (const v of b) {
      x -= v.x;
      y -= v.y;
      z -= v.z;
    }
    return new Float3(x, y, z);
  };
  const scaleFloat3 = _mathEx.scaleFloat3 = function (value) {
    let {
      x,
      y,
      z
    } = value;
    for (var _len4 = arguments.length, scalars = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      scalars[_key4 - 1] = arguments[_key4];
    }
    for (const s of scalars) {
      x *= s;
      y *= s;
      z *= s;
    }
    return new Float3(x, y, z);
  };
  const invertQuaternion = _mathEx.invertQuaternion = q => new Quaternion(-q.x, -q.y, -q.z, q.w);
  const _mulQuaternion = (a, b) => new Quaternion(a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y, a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z, a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x, a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z);
  const mulQuaternion = _mathEx.mulQuaternion = function (q) {
    for (var _len5 = arguments.length, qs = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      qs[_key5 - 1] = arguments[_key5];
    }
    return qs.reduce((acc, q) => _mulQuaternion(acc, q), q);
  };
  const dotQuaternion = _mathEx.dotQuaternion = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  const negQuaternion = _mathEx.negQuaternion = q => new Quaternion(-q.x, -q.y, -q.z, -q.w);
  const lengthQuaternion = _mathEx.lengthQuaternion = q => Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
  const axisAngleToQuaternion = _mathEx.axisAngleToQuaternion = (axis, angle) => {
    const {
      x,
      y,
      z
    } = math.normalizeFloat3(axis);
    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);
    return new Quaternion(x * s, y * s, z * s, Math.cos(halfAngle));
  };
  const transFloat3WithQuat = _mathEx.transFloat3WithQuat = (v, q) => mathEx.quaternionToAxisAngle(mathEx.mulQuaternion(q, mathEx.float3ToPureQuaternion(v), mathEx.invertQuaternion(q))).axis;
  const slerpQuaternion = _mathEx.slerpQuaternion = (a, b, t) => {
    let {
      x: ax,
      y: ay,
      z: az,
      w: aw
    } = a;
    let {
      x: bx,
      y: by,
      z: bz,
      w: bw
    } = b;
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
  const getAngularVelocityToUnit = _mathEx.getAngularVelocityToUnit = function (q) {
    let kp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
    let {
      x,
      y,
      z,
      w
    } = q;
    const sinHalfAngle = Math.sqrt(1 - w * w);
    if (sinHalfAngle < 1e-9) return new Float3(0, 0, 0);
    if (w < 0) {
      w = -w;
    } else {
      x = -x;
      y = -y;
      z = -z;
    }
    const ratio = kp * Math.acos(w) / sinHalfAngle;
    return new Float3(ratio * x, ratio * y, ratio * z);
  };
  const getAngularVelocityToTarget = _mathEx.getAngularVelocityToTarget = function (a) {
    let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Quaternion(0, 0, 0, 1);
    let kp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 8;
    let {
      x,
      y,
      z,
      w
    } = b;
    if (x === 0 && y === 0 && z === 0 && w === 1) return mathEx.getAngularVelocityToUnit(a, kp);
    ({
      x,
      y,
      z,
      w
    } = mathEx.mulQuaternion(mathEx.invertQuaternion(a), b));
    const sinHalfAngle = Math.sqrt(1 - w * w);
    if (sinHalfAngle < 1e-9) return new Float3(0, 0, 0);
    if (w < 0) {
      x = -x;
      y = -y;
      z = -z;
      w = -w;
    }
    const ratio = kp * Math.acos(w) / sinHalfAngle;
    return new Float3(ratio * x, ratio * y, ratio * z);
  };
  const float3ToPureQuaternion = _mathEx.float3ToPureQuaternion = v => new Quaternion(v.x, v.y, v.z, 0);
  const quaternionToAxisAngle = _mathEx.quaternionToAxisAngle = q => {
    const {
      x,
      y,
      z,
      w
    } = q;
    const s = Math.sqrt(1 - w * w);
    if (s < 1e-9) return {
      axis: new Float3(0, 1, 0),
      angle: 0
    };
    return {
      axis: new Float3(x / s, y / s, z / s),
      angle: 2 * Math.acos(w)
    };
  };
  const rotPosAroundAxis = _mathEx.rotPosAroundAxis = (currentPos, pivot, axis, angle) => mathEx.addFloat3(pivot, mathEx.transFloat3WithQuat(mathEx.subFloat3(currentPos, pivot), mathEx.axisAngleToQuaternion(axis, angle)));
  const rotQuatAroundAxis = _mathEx.rotQuatAroundAxis = (currentQuat, axis, angle) => mathEx.mulQuaternion(mathEx.axisAngleToQuaternion(axis, angle), currentQuat);
  const getQuatFromAxes = _mathEx.getQuatFromAxes = (v1, v2) => {
    const u1 = math.normalizeFloat3(v1);
    const u2 = math.normalizeFloat3(v2);
    const dot = math.dotProductFloat3(u1, u2);
    if (dot > 1 - 1e-9) return new Quaternion(0, 0, 0, 1);
    if (dot < -1 + 1e-9) {
      let axis = math.crossProductFloat3(u1, new Float3(1, 0, 0));
      if (math.lengthFloat3(axis) < 1e-9) axis = math.crossProductFloat3(u1, new Float3(0, 1, 0));
      const {
        x,
        y,
        z
      } = math.normalizeFloat3(axis);
      return new Quaternion(x, y, z, 0);
    }
    const {
      x,
      y,
      z
    } = math.crossProductFloat3(u1, u2);
    return math.normalizeQuaternion(new Quaternion(x, y, z, 1 + dot));
  };
  const getAccelerationByForceAtPoint = _mathEx.getAccelerationByForceAtPoint = (itemPos, itemQuat, forcePos, forceVec, mass, linearKp, angularKp) => ({
    linear: mathEx.scaleFloat3(forceVec, linearKp / mass),
    angular: mathEx.scaleFloat3(mathEx.transFloat3WithQuat(math.crossProductFloat3(mathEx.subFloat3(forcePos, itemPos), forceVec), mathEx.invertQuaternion(itemQuat)), angularKp / mass)
  });
  const getVelocityByForceAtPoint = _mathEx.getVelocityByForceAtPoint = (itemPos, itemQuat, forcePos, forceVec, originalLinearVel, originalAngularVel, mass, linearKp, angularKp) => {
    const {
      linear,
      angular
    } = mathEx.getAccelerationByForceAtPoint(itemPos, itemQuat, forcePos, forceVec, mass, linearKp, angularKp);
    return {
      linear: mathEx.addFloat3(originalLinearVel, linear),
      angular: mathEx.addFloat3(originalAngularVel, angular)
    };
  };
})(mathEx || (mathEx = {}));
export default mathEx;