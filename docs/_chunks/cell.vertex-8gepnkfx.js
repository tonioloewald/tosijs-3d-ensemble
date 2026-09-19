import{Oy as V}from"./site-j34e5v7z.js";import{gz as x}from"./site-dkfc1t93.js";import{hz as D}from"./site-bd94jn6g.js";import{Az as p}from"./site-2qj3m9e3.js";import{Ez as u}from"./site-qn42tyww.js";import{Hz as v}from"./site-zehpga8q.js";import{Iz as a}from"./site-9bjydj6j.js";import{Jz as d}from"./site-xf36gx1c.js";import{Kz as n,Lz as l}from"./site-s96bejdb.js";import{Mz as r}from"./site-j8wqv8am.js";import{Nz as c}from"./site-23881zbn.js";import{Oz as s}from"./site-zbp16tcx.js";import{Pz as f}from"./site-80rxy59e.js";import{Qz as m}from"./site-naexcj0b.js";import{Rz as t}from"./site-g67gdz3h.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="cellVertexShader",S=`precision highp float;attribute vec3 position;
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
#ifdef DIFFUSE
varying vec2 vDiffuseUV;uniform mat4 diffuseMatrix;uniform vec2 vDiffuseInfos;
#endif
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
#ifdef VERTEXCOLOR
vec4 colorUpdated=color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;vPositionW=vec3(worldPos);
#ifdef NORMAL
vNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#ifdef DIFFUSE
if (vDiffuseInfos.x==0.)
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));}
else
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));}
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStore[o])e.ShadersStore[o]=S;var g=[r,n,a,t,u,f,x,D,d,c,l,m,s,V,v,p];for(let i of g)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var W={name:o,shader:S};export{W as cellVertexShader};

//# debugId=3B002A703F2D335E64756E2164756E21
//# sourceMappingURL=cell.vertex-8gepnkfx.js.map
