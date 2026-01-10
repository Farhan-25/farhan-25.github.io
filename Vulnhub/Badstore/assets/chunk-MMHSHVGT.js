import {
  baseKeys_default,
  getTag_default
} from "./chunk-UMRDKDF4.js";
import {
  isArguments_default,
  isArrayLike_default,
  isArray_default,
  isBuffer_default,
  isPrototype_default,
  isTypedArray_default
} from "./chunk-AC74IHDH.js";

// ../../node_modules/lodash-es/isEmpty.js
var mapTag = "[object Map]";
var setTag = "[object Set]";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike_default(value) && (isArray_default(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer_default(value) || isTypedArray_default(value) || isArguments_default(value))) {
    return !value.length;
  }
  var tag = getTag_default(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype_default(value)) {
    return !baseKeys_default(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}
var isEmpty_default = isEmpty;

export {
  isEmpty_default
};
