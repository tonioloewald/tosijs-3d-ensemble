import{RC as o}from"./site-eq33q5cn.js";var e="handleVertexShader",i="precision highp float;attribute vec3 position;uniform vec3 positionOffset;uniform mat4 worldViewProjection;uniform float scale;void main(void) {vec4 vPos=vec4((vec3(position)+positionOffset)*scale,1.0);gl_Position=worldViewProjection*vPos;}";if(!o.ShadersStore[e])o.ShadersStore[e]=i;var r={name:e,shader:i};
export{r as fg};

//# debugId=29CE3D5610B02A2F64756E2164756E21
//# sourceMappingURL=site-4pakfrpf.js.map
