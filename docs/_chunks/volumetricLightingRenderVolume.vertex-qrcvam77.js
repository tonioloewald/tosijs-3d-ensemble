import{vt}from"./site-tgwn8dp1.js";import{Bi}from"./site-ktv67mk7.js";import{i}from"./site-1yf4ncc8.js";var o="volumetricLightingRenderVolumeVertexShader",r=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position : vec3f;varying vWorldPos: vec4f;@vertex
fn main(input : VertexInputs)->FragmentInputs {let worldPos=mesh.world*vec4f(vertexInputs.position,1.0);vertexOutputs.vWorldPos=worldPos;vertexOutputs.position=scene.viewProjection*worldPos;}
`;if(!i.ShadersStoreWGSL[o])i.ShadersStoreWGSL[o]=r;var t=[vt,Bi];for(let e of t)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var c={name:o,shader:r};export{c as volumetricLightingRenderVolumeVertexShaderWGSL};

//# debugId=D7D469EE6645BE5764756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-qrcvam77.js.map
