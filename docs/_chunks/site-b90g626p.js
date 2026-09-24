import{pA as x}from"./site-wf1en7zy.js";import{qA as p}from"./site-hk0hmjmw.js";import{rA as c}from"./site-agk71brw.js";import{sA as l}from"./site-f681an3w.js";import{tA as v}from"./site-6ba65z6z.js";import{UA as u}from"./site-pxptatb5.js";import{bB as a}from"./site-29fd8ct0.js";import{cB as i}from"./site-e8mkaftc.js";import{dB as f}from"./site-9f0f1722.js";import{eB as o}from"./site-x3amsbdm.js";import{fB as s}from"./site-64qw0dz6.js";import{gB as d}from"./site-9fm19mzr.js";import{jB as m}from"./site-51s6gww7.js";import{kB as n}from"./site-atnw9cpw.js";import{TC as e}from"./site-qntg4d3x.js";var r="outlineVertexShader",S=`attribute position: vec3f;attribute normal: vec3f;
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
export{k as Lg};

//# debugId=F18A989CC7B6A8DA64756E2164756E21
//# sourceMappingURL=site-b90g626p.js.map
