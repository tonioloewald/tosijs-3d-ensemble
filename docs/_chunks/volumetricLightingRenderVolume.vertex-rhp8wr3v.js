import{ok as s}from"./site-gdyej669.js";import{pk as n}from"./site-g2364nbt.js";import{Cz as i}from"./site-cnbgswsf.js";import{Dz as t}from"./site-s0jpz7fy.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var r="volumetricLightingRenderVolumeVertexShader",c=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;if(!e.ShadersStore[r])e.ShadersStore[r]=c;var d=[n,t,s,i];for(let o of d)if(!e.IncludesShadersStore[o.name])e.IncludesShadersStore[o.name]=o.shader;var S={name:r,shader:c};export{S as volumetricLightingRenderVolumeVertexShader};

//# debugId=4771699FF68F66E564756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-rhp8wr3v.js.map
