import{aA as s}from"./site-baggt5xc.js";import{kA as p}from"./site-64en31za.js";import{lA as x}from"./site-ygtxpekf.js";import{rA as V}from"./site-7b4wqcsz.js";import{SA as S}from"./site-tvsjdjzy.js";import{_A as m}from"./site-vjcvv95b.js";import{$A as a}from"./site-b0586s68.js";import{aB as n}from"./site-gvha0p8v.js";import{bB as d}from"./site-y76seb3a.js";import{cB as i}from"./site-xk1d5e3r.js";import{dB as u}from"./site-s2x1pkvg.js";import{eB as c}from"./site-e7fcp3dx.js";import{fB as v}from"./site-w3a7hzs8.js";import{gB as f}from"./site-ara777sk.js";import{hB as l}from"./site-x4w78gzw.js";import{iB as o}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var r="terrainVertexShader",L=`attribute position: vec3f;
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
varying vTextureUV: vec2f;uniform textureMatrix: mat4x4f;uniform vTextureInfos: vec2f;
#endif
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<logDepthDeclaration>
#include<clipPlaneVertexDeclaration>
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
if (uniforms.vTextureInfos.x==0.)
{vertexOutputs.vTextureUV=(uniforms.textureMatrix* vec4f(uv,1.0,0.0)).xy;}
else
{vertexOutputs.vTextureUV=(uniforms.textureMatrix* vec4f(uv2,1.0,0.0)).xy;}
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=L;var W=[i,n,a,S,o,f,s,x,d,c,u,l,V,v,p,m];for(let t of W)if(!e.IncludesShadersStoreWGSL[t.name])e.IncludesShadersStoreWGSL[t.name]=t.shader;var w={name:r,shader:L};export{w as terrainVertexShaderWGSL};

//# debugId=3FD14C256B82E5E964756E2164756E21
//# sourceMappingURL=terrain.vertex-r6f4h5sa.js.map
