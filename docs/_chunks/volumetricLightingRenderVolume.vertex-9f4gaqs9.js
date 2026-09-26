import{As}from"./site-4jmy86k5.js";import{St}from"./site-qq23efnd.js";import{wf}from"../hydrate.js";import{Ki}from"./site-343zg1tr.js";import{i}from"./site-1yf4ncc8.js";var o="volumetricLightingRenderVolumeVertexShader",r=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;if(!i.ShadersStore[o])i.ShadersStore[o]=r;var t=[As,St,wf,Ki];for(let e of t)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var l={name:o,shader:r};export{l as volumetricLightingRenderVolumeVertexShader};

//# debugId=0CC902AA6CA8080E64756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-9f4gaqs9.js.map
