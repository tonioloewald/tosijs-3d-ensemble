import{pA as p}from"./site-wf1en7zy.js";import{qA as l}from"./site-hk0hmjmw.js";import{rA as d}from"./site-agk71brw.js";import{sA as c}from"./site-f681an3w.js";import{bB as n}from"./site-29fd8ct0.js";import{cB as i}from"./site-e8mkaftc.js";import{dB as a}from"./site-9f0f1722.js";import{eB as o}from"./site-x3amsbdm.js";import{fB as m}from"./site-64qw0dz6.js";import{gB as s}from"./site-9fm19mzr.js";import{TC as e}from"./site-qntg4d3x.js";var t="pickingVertexShader",f=`attribute position: vec3f;
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
export{I as Yw};

//# debugId=143D3A61561F8B9064756E2164756E21
//# sourceMappingURL=site-m3na8ncf.js.map
