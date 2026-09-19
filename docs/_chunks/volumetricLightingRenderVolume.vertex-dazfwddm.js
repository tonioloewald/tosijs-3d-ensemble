import{TA as n}from"./site-gsg6fe8a.js";import{UA as t}from"./site-nr8e2t2t.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var r="volumetricLightingRenderVolumeVertexShader",s=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position : vec3f;varying vWorldPos: vec4f;@vertex
fn main(input : VertexInputs)->FragmentInputs {let worldPos=mesh.world*vec4f(vertexInputs.position,1.0);vertexOutputs.vWorldPos=worldPos;vertexOutputs.position=scene.viewProjection*worldPos;}
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=s;var i=[t,n];for(let o of i)if(!e.IncludesShadersStoreWGSL[o.name])e.IncludesShadersStoreWGSL[o.name]=o.shader;var l={name:r,shader:s};export{l as volumetricLightingRenderVolumeVertexShaderWGSL};

//# debugId=C52B009530457BCE64756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-dazfwddm.js.map
