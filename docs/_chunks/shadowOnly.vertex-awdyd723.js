import{pk as v}from"./site-g2364nbt.js";import{Oy as x}from"./site-j34e5v7z.js";import{gz as u}from"./site-dkfc1t93.js";import{hz as S}from"./site-bd94jn6g.js";import{Az as h}from"./site-2qj3m9e3.js";import{Dz as p}from"./site-s0jpz7fy.js";import{Ez as V}from"./site-qn42tyww.js";import{Iz as l}from"./site-9bjydj6j.js";import{Jz as c}from"./site-xf36gx1c.js";import{Kz as n,Lz as f}from"./site-s96bejdb.js";import{Mz as r}from"./site-j8wqv8am.js";import{Nz as d}from"./site-23881zbn.js";import{Oz as s}from"./site-zbp16tcx.js";import{Pz as a}from"./site-80rxy59e.js";import{Qz as m}from"./site-naexcj0b.js";import{Rz as t}from"./site-g67gdz3h.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="shadowOnlyVertexShader",D=`precision highp float;attribute vec3 position;
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

//# debugId=761D138840F762A064756E2164756E21
//# sourceMappingURL=shadowOnly.vertex-awdyd723.js.map
