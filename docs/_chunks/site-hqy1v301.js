import{Hz as V}from"./site-zehpga8q.js";import{Iz as d}from"./site-9bjydj6j.js";import{Jz as c}from"./site-xf36gx1c.js";import{Kz as n,Lz as f}from"./site-s96bejdb.js";import{Mz as r}from"./site-j8wqv8am.js";import{Nz as l}from"./site-23881zbn.js";import{Oz as s}from"./site-zbp16tcx.js";import{Pz as a}from"./site-80rxy59e.js";import{Qz as m}from"./site-naexcj0b.js";import{Rz as t}from"./site-g67gdz3h.js";import{RC as e}from"./site-eq33q5cn.js";var i="colorVertexShader",x=`attribute vec3 position;
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
export{g as Gz};

//# debugId=8A0E2444147F0DB864756E2164756E21
//# sourceMappingURL=site-hqy1v301.js.map
