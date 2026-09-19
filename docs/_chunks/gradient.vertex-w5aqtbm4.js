import{aA as u}from"./site-baggt5xc.js";import{kA as S}from"./site-64en31za.js";import{lA as x}from"./site-ygtxpekf.js";import{rA as V}from"./site-7b4wqcsz.js";import{SA as p}from"./site-tvsjdjzy.js";import{_A as s}from"./site-vjcvv95b.js";import{$A as f}from"./site-b0586s68.js";import{aB as o}from"./site-gvha0p8v.js";import{bB as c}from"./site-y76seb3a.js";import{cB as r}from"./site-xk1d5e3r.js";import{dB as l}from"./site-s2x1pkvg.js";import{eB as d}from"./site-e7fcp3dx.js";import{fB as m}from"./site-w3a7hzs8.js";import{gB as a}from"./site-ara777sk.js";import{hB as v}from"./site-x4w78gzw.js";import{iB as n}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var t="gradientVertexShader",L=`attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform view: mat4x4f;uniform viewProjection: mat4x4f;
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;varying vPosition: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;vertexOutputs.vPositionW= worldPos.xyz;vertexOutputs.vPosition=vertexInputs.position;
#ifdef NORMAL
vertexOutputs.vNormalW=normalize(( finalWorld* vec4f(vertexInputs.normal,0.0)).xyz);
#endif
#ifndef UV1
var uv: vec2f= vec2f(0.,0.);
#else
var uv: vec2f=vertexInputs.uv;
#endif
#ifndef UV2
var uv2: vec2f= vec2f(0.,0.);
#else
var uv2: vec2f=vertexInputs.uv2;
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=L;var W=[r,o,f,n,p,a,u,x,c,d,l,v,V,m,S,s];for(let i of W)if(!e.IncludesShadersStoreWGSL[i.name])e.IncludesShadersStoreWGSL[i.name]=i.shader;var w={name:t,shader:L};export{w as gradientVertexShaderWGSL};

//# debugId=5A73297B720CB33F64756E2164756E21
//# sourceMappingURL=gradient.vertex-w5aqtbm4.js.map
