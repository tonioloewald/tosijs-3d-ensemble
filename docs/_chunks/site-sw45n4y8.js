import{nA as x}from"./site-cdfrs8gm.js";import{oA as p}from"./site-4nsp2pg6.js";import{pA as c}from"./site-fmaaaf9d.js";import{qA as l}from"./site-37323n7e.js";import{rA as v}from"./site-7b4wqcsz.js";import{SA as u}from"./site-tvsjdjzy.js";import{$A as a}from"./site-b0586s68.js";import{aB as i}from"./site-gvha0p8v.js";import{bB as f}from"./site-y76seb3a.js";import{cB as o}from"./site-xk1d5e3r.js";import{dB as s}from"./site-s2x1pkvg.js";import{eB as d}from"./site-e7fcp3dx.js";import{hB as m}from"./site-x4w78gzw.js";import{iB as n}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";var r="outlineVertexShader",S=`attribute position: vec3f;attribute normal: vec3f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
uniform offset: f32;
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#ifdef ALPHATEST
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f; 
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input: VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;var normalUpdated: vec3f=vertexInputs.normal;
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
var offsetPosition: vec3f=positionUpdated+(normalUpdated*uniforms.offset);
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(offsetPosition,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
}
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=S;var V=[o,i,l,c,n,a,u,p,x,f,d,s,m,v];for(let t of V)if(!e.IncludesShadersStoreWGSL[t.name])e.IncludesShadersStoreWGSL[t.name]=t.shader;var k={name:r,shader:S};
export{k as Jg};

//# debugId=7C389B6EE1628A5F64756E2164756E21
//# sourceMappingURL=site-sw45n4y8.js.map
