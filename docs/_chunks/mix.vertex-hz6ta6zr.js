import{Oy as x}from"./site-j34e5v7z.js";import{gz as p}from"./site-dkfc1t93.js";import{hz as S}from"./site-bd94jn6g.js";import{Az as V}from"./site-2qj3m9e3.js";import{Ez as u}from"./site-qn42tyww.js";import{Hz as s}from"./site-zehpga8q.js";import{Iz as f}from"./site-9bjydj6j.js";import{Jz as d}from"./site-xf36gx1c.js";import{Kz as t,Lz as l}from"./site-s96bejdb.js";import{Mz as r}from"./site-j8wqv8am.js";import{Nz as c}from"./site-23881zbn.js";import{Oz as v}from"./site-zbp16tcx.js";import{Pz as a}from"./site-80rxy59e.js";import{Qz as m}from"./site-naexcj0b.js";import{Rz as n}from"./site-g67gdz3h.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="mixVertexShader",g=`precision highp float;attribute vec3 position;
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
varying vec2 vTextureUV;uniform mat4 textureMatrix;uniform vec2 vTextureInfos;
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
if (vTextureInfos.x==0.)
{vTextureUV=vec2(textureMatrix*vec4(uv,1.0,0.0));}
else
{vTextureUV=vec2(textureMatrix*vec4(uv2,1.0,0.0));}
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
`;if(!e.ShadersStore[o])e.ShadersStore[o]=g;var h=[r,t,f,n,u,a,p,S,d,c,l,m,v,x,s,V];for(let i of h)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var W={name:o,shader:g};export{W as mixVertexShader};

//# debugId=281EF0F35070303464756E2164756E21
//# sourceMappingURL=mix.vertex-hz6ta6zr.js.map
