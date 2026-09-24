import{cA as p}from"./site-fz2nkd1r.js";import{mA as L}from"./site-85pnbfn7.js";import{nA as x}from"./site-vmkj4852.js";import{tA as V}from"./site-6ba65z6z.js";import{UA as u}from"./site-pxptatb5.js";import{WA as S}from"./site-mevm09sp.js";import{bB as l}from"./site-29fd8ct0.js";import{cB as o}from"./site-e8mkaftc.js";import{dB as c}from"./site-9f0f1722.js";import{eB as r}from"./site-x3amsbdm.js";import{fB as d}from"./site-64qw0dz6.js";import{gB as f}from"./site-9fm19mzr.js";import{hB as s}from"./site-fpk64j4h.js";import{iB as a}from"./site-mz6nphdx.js";import{jB as m}from"./site-51s6gww7.js";import{kB as n}from"./site-atnw9cpw.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var i="shadowOnlyVertexShader",W=`attribute position: vec3f;
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

//# debugId=AF0493F838E7F74F64756E2164756E21
//# sourceMappingURL=shadowOnly.vertex-e46hdr83.js.map
