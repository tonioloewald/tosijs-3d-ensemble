import{aA as u}from"./site-baggt5xc.js";import{kA as V}from"./site-64en31za.js";import{lA as S}from"./site-ygtxpekf.js";import{rA as g}from"./site-7b4wqcsz.js";import{RA as s}from"./site-cgmwaca2.js";import{SA as p}from"./site-tvsjdjzy.js";import{_A as x}from"./site-vjcvv95b.js";import{$A as l}from"./site-b0586s68.js";import{aB as o}from"./site-gvha0p8v.js";import{bB as f}from"./site-y76seb3a.js";import{cB as i}from"./site-xk1d5e3r.js";import{dB as m}from"./site-s2x1pkvg.js";import{eB as d}from"./site-e7fcp3dx.js";import{fB as v}from"./site-w3a7hzs8.js";import{gB as a}from"./site-ara777sk.js";import{hB as c}from"./site-x4w78gzw.js";import{iB as t}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var n="triplanarVertexShader",z=`attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<helperFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform view: mat4x4f;uniform viewProjection: mat4x4f;
#ifdef DIFFUSEX
varying vTextureUVX: vec2f;
#endif
#ifdef DIFFUSEY
varying vTextureUVY: vec2f;
#endif
#ifdef DIFFUSEZ
varying vTextureUVZ: vec2f;
#endif
uniform tileSize: f32;
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
#ifdef NORMAL
varying tangentSpace0: vec3f;varying tangentSpace1: vec3f;varying tangentSpace2: vec3f;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
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
fn main(input : VertexInputs)->FragmentInputs
{
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;vertexOutputs.vPositionW= worldPos.xyz;
#ifdef DIFFUSEX
vertexOutputs.vTextureUVX=worldPos.zy/uniforms.tileSize;
#endif
#ifdef DIFFUSEY
vertexOutputs.vTextureUVY=worldPos.xz/uniforms.tileSize;
#endif
#ifdef DIFFUSEZ
vertexOutputs.vTextureUVZ=worldPos.xy/uniforms.tileSize;
#endif
#ifdef NORMAL
var xtan: vec3f= vec3f(0,0,1);var xbin: vec3f= vec3f(0,1,0);var ytan: vec3f= vec3f(1,0,0);var ybin: vec3f= vec3f(0,0,1);var ztan: vec3f= vec3f(1,0,0);var zbin: vec3f= vec3f(0,1,0);var normalizedNormal: vec3f=normalize(vertexInputs.normal);normalizedNormal=normalizedNormal*normalizedNormal;var worldBinormal: vec3f=normalize(xbin*normalizedNormal.x+ybin*normalizedNormal.y+zbin*normalizedNormal.z);var worldTangent: vec3f=normalize(xtan*normalizedNormal.x+ytan*normalizedNormal.y+ztan*normalizedNormal.z);var normalWorld: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
worldTangent=normalize((normalWorld*worldTangent).xyz);worldBinormal=normalize((normalWorld*worldBinormal).xyz);var worldNormal: vec3f=normalize((normalWorld*normalize(vertexInputs.normal)).xyz);vertexOutputs.tangentSpace0=worldTangent;vertexOutputs.tangentSpace1=worldBinormal;vertexOutputs.tangentSpace2=worldNormal;
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStoreWGSL[n])e.ShadersStoreWGSL[n]=z;var L=[s,i,o,l,t,p,a,u,S,f,d,m,c,g,v,V,x];for(let r of L)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var _={name:n,shader:z};export{_ as triplanarVertexShaderWGSL};

//# debugId=2FDB013076B40F4864756E2164756E21
//# sourceMappingURL=triplanar.vertex-k7jq0x9s.js.map
