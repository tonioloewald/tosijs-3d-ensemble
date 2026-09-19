import{aA as m}from"./site-baggt5xc.js";import{kA as S}from"./site-64en31za.js";import{lA as v}from"./site-ygtxpekf.js";import{rA as p}from"./site-7b4wqcsz.js";import{SA as x}from"./site-tvsjdjzy.js";import{$A as a}from"./site-b0586s68.js";import{aB as n}from"./site-gvha0p8v.js";import{bB as s}from"./site-y76seb3a.js";import{cB as r}from"./site-xk1d5e3r.js";import{dB as c}from"./site-s2x1pkvg.js";import{eB as u}from"./site-e7fcp3dx.js";import{fB as l}from"./site-w3a7hzs8.js";import{gB as f}from"./site-ara777sk.js";import{hB as d}from"./site-x4w78gzw.js";import{iB as o}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var t="normalVertexShader",V=`attribute position: vec3f;
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
#ifdef DIFFUSE
varying vDiffuseUV: vec2f;uniform diffuseMatrix: mat4x4f;uniform vDiffuseInfos: vec2f;
#endif
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
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
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;vertexOutputs.vPositionW= worldPos.xyz;
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
#ifdef DIFFUSE
if (uniforms.vDiffuseInfos.x==0.)
{vertexOutputs.vDiffuseUV=(uniforms.diffuseMatrix* vec4f(uv,1.0,0.0)).xy;}
else
{vertexOutputs.vDiffuseUV=(uniforms.diffuseMatrix* vec4f(uv2,1.0,0.0)).xy;}
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=V;var L=[r,n,a,o,x,f,m,v,s,u,c,d,p,l,S];for(let i of L)if(!e.IncludesShadersStoreWGSL[i.name])e.IncludesShadersStoreWGSL[i.name]=i.shader;var w={name:t,shader:V};export{w as normalVertexShaderWGSL};

//# debugId=F3EEA95DB4B76FE964756E2164756E21
//# sourceMappingURL=normal.vertex-4az70zgg.js.map
