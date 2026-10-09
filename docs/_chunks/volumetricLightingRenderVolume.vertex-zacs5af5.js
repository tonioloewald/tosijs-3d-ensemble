import{Rs}from"./site-7gcmth7v.js";import{St}from"./site-qq23efnd.js";import{Df}from"../hydrate-ebez5aj3.js";import{er}from"./site-dczbxq39.js";import{i}from"./site-1yf4ncc8.js";var o="volumetricLightingRenderVolumeVertexShader",r=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;if(!i.ShadersStore[o])i.ShadersStore[o]=r;var t=[Rs,St,Df,er];for(let e of t)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var l={name:o,shader:r};export{l as volumetricLightingRenderVolumeVertexShader};

//# debugId=C98DA78C361260F364756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-zacs5af5.js.map
