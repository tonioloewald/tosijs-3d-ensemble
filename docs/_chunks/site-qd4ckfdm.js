import{nA as p}from"./site-cdfrs8gm.js";import{oA as l}from"./site-4nsp2pg6.js";import{pA as d}from"./site-fmaaaf9d.js";import{qA as c}from"./site-37323n7e.js";import{$A as n}from"./site-b0586s68.js";import{aB as i}from"./site-gvha0p8v.js";import{bB as a}from"./site-y76seb3a.js";import{cB as o}from"./site-xk1d5e3r.js";import{dB as m}from"./site-s2x1pkvg.js";import{eB as s}from"./site-e7fcp3dx.js";import{RC as e}from"./site-eq33q5cn.js";var t="pickingVertexShader",f=`attribute position: vec3f;
#if defined(INSTANCES)
attribute instanceMeshID: f32;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(INSTANCES)
flat varying vMeshID: f32;
#endif
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#if defined(INSTANCES)
vertexOutputs.vMeshID=vertexInputs.instanceMeshID;
#endif
}
`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=f;var S=[o,i,c,d,n,l,p,a,s,m];for(let r of S)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var I={name:t,shader:f};
export{I as Ww};

//# debugId=E021674D8D15916864756E2164756E21
//# sourceMappingURL=site-qd4ckfdm.js.map
