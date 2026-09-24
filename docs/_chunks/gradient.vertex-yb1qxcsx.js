import{Qy as u}from"./site-xy0rkv6f.js";import{iz as x}from"./site-nzqnrmaj.js";import{jz as g}from"./site-h8e2z66v.js";import{Cz as V}from"./site-b4abssv4.js";import{Gz as p}from"./site-5396gbjx.js";import{Jz as v}from"./site-4qpva6fd.js";import{Kz as d}from"./site-14avg1cz.js";import{Lz as f}from"./site-vzpq9esa.js";import{Mz as t,Nz as c}from"./site-a8g5nnxf.js";import{Oz as r}from"./site-adck33zp.js";import{Pz as l}from"./site-qq7x7ynn.js";import{Qz as s}from"./site-fcc7k5fg.js";import{Rz as a}from"./site-2mbnfcv5.js";import{Sz as m}from"./site-htnx42ev.js";import{Tz as n}from"./site-aywapsn3.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var o="gradientVertexShader",S=`precision highp float;attribute vec3 position;
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

//# debugId=F4B997BF01EE420064756E2164756E21
//# sourceMappingURL=gradient.vertex-yb1qxcsx.js.map
