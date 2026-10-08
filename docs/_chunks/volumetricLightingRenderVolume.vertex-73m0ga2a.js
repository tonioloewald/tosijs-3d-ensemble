import{Rs}from"./site-mmnpf395.js";import{St}from"./site-qq23efnd.js";import{Df}from"../hydrate-2zf8k7cp.js";import{Ji}from"./site-wrm5na7z.js";import{i}from"./site-1yf4ncc8.js";var o="volumetricLightingRenderVolumeVertexShader",r=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;if(!i.ShadersStore[o])i.ShadersStore[o]=r;var t=[Rs,St,Df,Ji];for(let e of t)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var l={name:o,shader:r};export{l as volumetricLightingRenderVolumeVertexShader};

//# debugId=A4A7619D7F71266A64756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-73m0ga2a.js.map
