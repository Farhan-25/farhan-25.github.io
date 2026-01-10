import {
  StateDB,
  stateDiagram_default,
  stateRenderer_v3_unified_default,
  styles_default
} from "./chunk-FWQMFT44.js";
import "./chunk-PFXQX2Y7.js";
import "./chunk-6SIZP672.js";
import "./chunk-WINAANFJ.js";
import "./chunk-H5PYWCUD.js";
import "./chunk-3X24VTB7.js";
import "./chunk-ALQLWK4Q.js";
import "./chunk-IK2YVULW.js";
import "./chunk-T6N5NIZF.js";
import "./chunk-ERXSOLO3.js";
import "./chunk-F2OBZR3M.js";
import "./chunk-7IK5N4XB.js";
import "./chunk-OIESMJRM.js";
import "./chunk-AC74IHDH.js";
import {
  __name
} from "./chunk-2DQTVN24.js";
import "./chunk-2P3A4VVY.js";

// ../../node_modules/mermaid/dist/chunks/mermaid.core/stateDiagram-v2-4FDKWEC3.mjs
var diagram = {
  parser: stateDiagram_default,
  get db() {
    return new StateDB(2);
  },
  renderer: stateRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
