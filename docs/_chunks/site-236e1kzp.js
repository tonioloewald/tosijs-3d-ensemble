import{pA as f}from"./site-wf1en7zy.js";import{qA as c}from"./site-hk0hmjmw.js";import{rA as s}from"./site-agk71brw.js";import{sA as d}from"./site-f681an3w.js";import{bB as n}from"./site-29fd8ct0.js";import{cB as a}from"./site-e8mkaftc.js";import{dB as i}from"./site-9f0f1722.js";import{eB as t}from"./site-x3amsbdm.js";import{fB as l}from"./site-64qw0dz6.js";import{gB as m}from"./site-9fm19mzr.js";import{TC as e}from"./site-qntg4d3x.js";var o="meshUVSpaceRendererVertexShader",S=`attribute position: vec3f;attribute normal: vec3f;attribute uv: vec2f;uniform projMatrix: mat4x4f;varying vDecalTC: vec2f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;var normalUpdated: vec3f=vertexInputs.normal;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);var normWorldSM: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);var vNormalW: vec3f;
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vNormalW=normalUpdated/ vec3f(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vNormalW=normalize(normWorldSM*normalUpdated);
#endif
var normalView: vec3f=normalize((uniforms.projMatrix* vec4f(vNormalW,0.0)).xyz);var decalTC: vec3f=(uniforms.projMatrix*worldPos).xyz;vertexOutputs.vDecalTC=decalTC.xy;vertexOutputs.position=vec4f(vertexInputs.uv*2.0-1.0,select(decalTC.z,2.,normalView.z>0.0),1.0);}`;if(!e.ShadersStoreWGSL[o])e.ShadersStoreWGSL[o]=S;var p=[t,a,d,s,n,c,f,i,m,l];for(let r of p)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var N={name:o,shader:S};
export{N as Fh};

//# debugId=A79FAB6AC8FD049A64756E2164756E21
//# sourceMappingURL=site-236e1kzp.js.map
