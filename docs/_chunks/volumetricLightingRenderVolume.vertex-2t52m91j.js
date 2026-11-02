import{Rs}from"./site-zzh1b3xb.js";import{Tt}from"./site-168r1eye.js";import{Bf}from"../hydrate-kz831vp4.js";import{rr}from"./site-rpe8qg21.js";import{i}from"./site-1yf4ncc8.js";var o="volumetricLightingRenderVolumeVertexShader",r=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;if(!i.ShadersStore[o])i.ShadersStore[o]=r;var t=[Rs,Tt,Bf,rr];for(let e of t)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var l={name:o,shader:r};export{l as volumetricLightingRenderVolumeVertexShader};

//# debugId=C043B773E62730E664756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-2t52m91j.js.map
