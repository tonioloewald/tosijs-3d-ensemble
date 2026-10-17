import{Rs}from"./site-x0f2b201.js";import{yt}from"./site-ngk6phyz.js";import{Df}from"../hydrate-z1tms1ef.js";import{er}from"./site-dczbxq39.js";import{i}from"./site-1yf4ncc8.js";var o="volumetricLightingRenderVolumeVertexShader",r=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;if(!i.ShadersStore[o])i.ShadersStore[o]=r;var t=[Rs,yt,Df,er];for(let e of t)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var l={name:o,shader:r};export{l as volumetricLightingRenderVolumeVertexShader};

//# debugId=E46CEE7CEC7DA2F964756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-trh183bb.js.map
