import{qk as s}from"./site-q3x79wng.js";import{rk as n}from"./site-ptk3bhbp.js";import{Ez as i}from"./site-g6w7j0j2.js";import{Fz as t}from"./site-2zvtkt7b.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var r="volumetricLightingRenderVolumeVertexShader",c=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;if(!e.ShadersStore[r])e.ShadersStore[r]=c;var d=[n,t,s,i];for(let o of d)if(!e.IncludesShadersStore[o.name])e.IncludesShadersStore[o.name]=o.shader;var S={name:r,shader:c};export{S as volumetricLightingRenderVolumeVertexShader};

//# debugId=DD2C04F7563449FD64756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-ew3e8r0b.js.map
