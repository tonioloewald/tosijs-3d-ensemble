import{TC as o}from"./site-qntg4d3x.js";var e="handleVertexShader",i="precision highp float;attribute vec3 position;uniform vec3 positionOffset;uniform mat4 worldViewProjection;uniform float scale;void main(void) {vec4 vPos=vec4((vec3(position)+positionOffset)*scale,1.0);gl_Position=worldViewProjection*vPos;}";if(!o.ShadersStore[e])o.ShadersStore[e]=i;var r={name:e,shader:i};
export{r as hg};

//# debugId=5BADD38DD68F52CD64756E2164756E21
//# sourceMappingURL=site-naahsw20.js.map
