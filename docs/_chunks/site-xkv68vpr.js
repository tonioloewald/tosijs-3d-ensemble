import{Jz as V}from"./site-4qpva6fd.js";import{Kz as d}from"./site-14avg1cz.js";import{Lz as c}from"./site-vzpq9esa.js";import{Mz as n,Nz as f}from"./site-a8g5nnxf.js";import{Oz as r}from"./site-adck33zp.js";import{Pz as l}from"./site-qq7x7ynn.js";import{Qz as s}from"./site-fcc7k5fg.js";import{Rz as a}from"./site-2mbnfcv5.js";import{Sz as m}from"./site-htnx42ev.js";import{Tz as t}from"./site-aywapsn3.js";import{TC as e}from"./site-qntg4d3x.js";var i="colorVertexShader",x=`attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform mat4 view;
#endif
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
vec4 colorUpdated=color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;if(!e.ShadersStore[i])e.ShadersStore[i]=x;var p=[r,n,t,a,d,c,l,f,m,s,V];for(let o of p)if(!e.IncludesShadersStore[o.name])e.IncludesShadersStore[o.name]=o.shader;var g={name:i,shader:x};
export{g as Iz};

//# debugId=B7B72F98339DE26C64756E2164756E21
//# sourceMappingURL=site-xkv68vpr.js.map
