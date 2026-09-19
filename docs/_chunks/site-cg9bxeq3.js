import{nA as f}from"./site-cdfrs8gm.js";import{oA as c}from"./site-4nsp2pg6.js";import{pA as s}from"./site-fmaaaf9d.js";import{qA as d}from"./site-37323n7e.js";import{$A as n}from"./site-b0586s68.js";import{aB as a}from"./site-gvha0p8v.js";import{bB as i}from"./site-y76seb3a.js";import{cB as t}from"./site-xk1d5e3r.js";import{dB as l}from"./site-s2x1pkvg.js";import{eB as m}from"./site-e7fcp3dx.js";import{RC as e}from"./site-eq33q5cn.js";var o="meshUVSpaceRendererVertexShader",S=`attribute position: vec3f;attribute normal: vec3f;attribute uv: vec2f;uniform projMatrix: mat4x4f;varying vDecalTC: vec2f;
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
export{N as Dh};

//# debugId=EB29F920754FE03364756E2164756E21
//# sourceMappingURL=site-cg9bxeq3.js.map
