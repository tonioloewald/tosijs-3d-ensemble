import{Rs}from"./site-swjqqwy5.js";import{yt}from"./site-ngk6phyz.js";import{Df}from"../hydrate-q7e82r0a.js";import{tr}from"./site-yr6cf034.js";import{i}from"./site-1yf4ncc8.js";var o="volumetricLightingRenderVolumeVertexShader",r=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;if(!i.ShadersStore[o])i.ShadersStore[o]=r;var t=[Rs,yt,Df,tr];for(let e of t)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var l={name:o,shader:r};export{l as volumetricLightingRenderVolumeVertexShader};

//# debugId=0C47706825ADA99464756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-da45cvzy.js.map
