import{aB as S}from"./site-y0vndwz9.js";import{bB as c}from"./site-29fd8ct0.js";import{cB as t}from"./site-e8mkaftc.js";import{dB as f}from"./site-9f0f1722.js";import{eB as i}from"./site-x3amsbdm.js";import{fB as l}from"./site-64qw0dz6.js";import{gB as d}from"./site-9fm19mzr.js";import{hB as s}from"./site-fpk64j4h.js";import{iB as a}from"./site-mz6nphdx.js";import{jB as m}from"./site-51s6gww7.js";import{kB as n}from"./site-atnw9cpw.js";import{TC as e}from"./site-qntg4d3x.js";var o="colorVertexShader",x=`attribute position: vec3f;
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
export{b as $A};

//# debugId=67FF8F268AD31C6264756E2164756E21
//# sourceMappingURL=site-k0zk9zpy.js.map
