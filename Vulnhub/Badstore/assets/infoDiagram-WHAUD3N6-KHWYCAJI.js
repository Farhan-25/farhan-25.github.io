import {
  package_default
} from "./chunk-NHL2GWMF.js";
import {
  parse
} from "./chunk-E7NHVONA.js";
import {
  selectSvgElement
} from "./chunk-ZVQIEZRD.js";
import "./chunk-N5HEOC6V.js";
import "./chunk-KW3I2AV5.js";
import "./chunk-7FSJEZ5E.js";
import "./chunk-4WBBZUSR.js";
import "./chunk-ZFYBQKZZ.js";
import "./chunk-Z67AEQ2D.js";
import "./chunk-RYAOJSZU.js";
import "./chunk-OBZA3MUO.js";
import "./chunk-6TNVQ2K2.js";
import "./chunk-MMHSHVGT.js";
import "./chunk-UMRDKDF4.js";
import {
  configureSvgSize
} from "./chunk-OIESMJRM.js";
import "./chunk-AC74IHDH.js";
import {
  __name,
  log
} from "./chunk-2DQTVN24.js";
import "./chunk-2P3A4VVY.js";

// ../../node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-WHAUD3N6.mjs
var parser = {
  parse: /* @__PURE__ */ __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};
var DEFAULT_INFO_DB = {
  version: package_default.version + (true ? "" : "-tiny")
};
var getVersion = /* @__PURE__ */ __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};
var draw = /* @__PURE__ */ __name((text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
