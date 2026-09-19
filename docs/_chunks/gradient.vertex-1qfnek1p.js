import{Oy as u}from"./site-j34e5v7z.js";import{gz as x}from"./site-dkfc1t93.js";import{hz as g}from"./site-bd94jn6g.js";import{Az as V}from"./site-2qj3m9e3.js";import{Ez as p}from"./site-qn42tyww.js";import{Hz as v}from"./site-zehpga8q.js";import{Iz as d}from"./site-9bjydj6j.js";import{Jz as f}from"./site-xf36gx1c.js";import{Kz as t,Lz as c}from"./site-s96bejdb.js";import{Mz as r}from"./site-j8wqv8am.js";import{Nz as l}from"./site-23881zbn.js";import{Oz as s}from"./site-zbp16tcx.js";import{Pz as a}from"./site-80rxy59e.js";import{Qz as m}from"./site-naexcj0b.js";import{Rz as n}from"./site-g67gdz3h.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="gradientVertexShader",S=`precision highp float;attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform mat4 view;uniform mat4 viewProjection;
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;varying vec3 vPosition;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying float vViewDepth;
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
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;vPositionW=vec3(worldPos);vPosition=position;
#ifdef NORMAL
vNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStore[o])e.ShadersStore[o]=S;var h=[r,t,d,n,p,a,x,g,f,l,c,m,V,s,u,v];for(let i of h)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var X={name:o,shader:S};export{X as gradientVertexShader};

//# debugId=BCE417B5C19D4A9264756E2164756E21
//# sourceMappingURL=gradient.vertex-1qfnek1p.js.map
