import{VA as n}from"./site-d77ts3q3.js";import{WA as t}from"./site-mevm09sp.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var r="volumetricLightingRenderVolumeVertexShader",s=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position : vec3f;varying vWorldPos: vec4f;@vertex
fn main(input : VertexInputs)->FragmentInputs {let worldPos=mesh.world*vec4f(vertexInputs.position,1.0);vertexOutputs.vWorldPos=worldPos;vertexOutputs.position=scene.viewProjection*worldPos;}
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=s;var i=[t,n];for(let o of i)if(!e.IncludesShadersStoreWGSL[o.name])e.IncludesShadersStoreWGSL[o.name]=o.shader;var l={name:r,shader:s};export{l as volumetricLightingRenderVolumeVertexShaderWGSL};

//# debugId=513E58C55688448964756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-qggzf6vg.js.map
