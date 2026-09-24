import{rk as v}from"./site-ptk3bhbp.js";import{Qy as x}from"./site-xy0rkv6f.js";import{iz as u}from"./site-nzqnrmaj.js";import{jz as S}from"./site-h8e2z66v.js";import{Cz as h}from"./site-b4abssv4.js";import{Fz as p}from"./site-2zvtkt7b.js";import{Gz as V}from"./site-5396gbjx.js";import{Kz as l}from"./site-14avg1cz.js";import{Lz as c}from"./site-vzpq9esa.js";import{Mz as n,Nz as f}from"./site-a8g5nnxf.js";import{Oz as r}from"./site-adck33zp.js";import{Pz as d}from"./site-qq7x7ynn.js";import{Qz as s}from"./site-fcc7k5fg.js";import{Rz as a}from"./site-2mbnfcv5.js";import{Sz as m}from"./site-htnx42ev.js";import{Tz as t}from"./site-aywapsn3.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var o="shadowOnlyVertexShader",D=`precision highp float;attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<__decl__sceneVertex>
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
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
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;vPositionW=vec3(worldPos);
#ifdef NORMAL
vNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStore[o])e.ShadersStore[o]=D;var g=[r,n,l,v,p,t,V,a,u,S,c,d,f,m,h,s,x];for(let i of g)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var z={name:o,shader:D};export{z as shadowOnlyVertexShader};

//# debugId=321E72D3F7F63EC864756E2164756E21
//# sourceMappingURL=shadowOnly.vertex-ab0bnk3g.js.map
