import{_A as S}from"./site-vjcvv95b.js";import{$A as c}from"./site-b0586s68.js";import{aB as t}from"./site-gvha0p8v.js";import{bB as f}from"./site-y76seb3a.js";import{cB as i}from"./site-xk1d5e3r.js";import{dB as l}from"./site-s2x1pkvg.js";import{eB as d}from"./site-e7fcp3dx.js";import{fB as s}from"./site-w3a7hzs8.js";import{gB as a}from"./site-ara777sk.js";import{hB as m}from"./site-x4w78gzw.js";import{iB as n}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";var o="colorVertexShader",x=`attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform view: mat4x4f;
#endif
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
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
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;if(!e.ShadersStoreWGSL[o])e.ShadersStoreWGSL[o]=x;var p=[i,t,n,a,c,f,d,l,m,s,S];for(let r of p)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var b={name:o,shader:x};
export{b as ZA};

//# debugId=DA69037A83BE0BEA64756E2164756E21
//# sourceMappingURL=site-f1eqjztq.js.map
