import{aA as p}from"./site-baggt5xc.js";import{kA as L}from"./site-64en31za.js";import{lA as x}from"./site-ygtxpekf.js";import{rA as V}from"./site-7b4wqcsz.js";import{SA as u}from"./site-tvsjdjzy.js";import{UA as S}from"./site-nr8e2t2t.js";import{$A as l}from"./site-b0586s68.js";import{aB as o}from"./site-gvha0p8v.js";import{bB as c}from"./site-y76seb3a.js";import{cB as r}from"./site-xk1d5e3r.js";import{dB as d}from"./site-s2x1pkvg.js";import{eB as f}from"./site-e7fcp3dx.js";import{fB as s}from"./site-w3a7hzs8.js";import{gB as a}from"./site-ara777sk.js";import{hB as m}from"./site-x4w78gzw.js";import{iB as n}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var i="shadowOnlyVertexShader",W=`attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<sceneUboDeclaration>
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
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
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=scene.viewProjection*worldPos;vertexOutputs.vPositionW= worldPos.xyz;
#ifdef NORMAL
vertexOutputs.vNormalW=normalize(( finalWorld* vec4f(vertexInputs.normal,0.0)).xyz);
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStoreWGSL[i])e.ShadersStoreWGSL[i]=W;var v=[r,o,l,S,n,u,a,p,x,c,f,d,m,V,s,L];for(let t of v)if(!e.IncludesShadersStoreWGSL[t.name])e.IncludesShadersStoreWGSL[t.name]=t.shader;var R={name:i,shader:W};export{R as shadowOnlyVertexShaderWGSL};

//# debugId=469C8CB2FF88EC6A64756E2164756E21
//# sourceMappingURL=shadowOnly.vertex-78jdwv5m.js.map
