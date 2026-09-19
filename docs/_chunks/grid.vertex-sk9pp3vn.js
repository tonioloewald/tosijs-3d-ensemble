import{pk as s}from"./site-g2364nbt.js";import{Az as v}from"./site-2qj3m9e3.js";import{Dz as f}from"./site-s0jpz7fy.js";import{Ez as l}from"./site-qn42tyww.js";import{Iz as n}from"./site-9bjydj6j.js";import{Jz as c}from"./site-xf36gx1c.js";import{Oz as d}from"./site-zbp16tcx.js";import{Pz as t}from"./site-80rxy59e.js";import{Qz as a}from"./site-naexcj0b.js";import{Rz as r}from"./site-g67gdz3h.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="gridVertexShader",p=`precision highp float;attribute vec3 position;attribute vec3 normal;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#include<instancesDeclaration>
#include<__decl__sceneVertex>
varying vec3 vPosition;varying vec3 vNormal;
#if defined(HORIZON_FADE) || defined(BELOW_LINE_COLOR) || defined(ORIGIN_MARKER)
varying vec3 vWorldPos;
#endif
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#ifdef OPACITY
varying vec2 vOpacityUV;uniform mat4 opacityMatrix;uniform vec2 vOpacityInfos;
#endif
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
vec4 worldPos=finalWorld*vec4(position,1.0);
#include<fogVertex>
vec4 cameraSpacePosition=view*worldPos;gl_Position=projection*cameraSpacePosition;
#ifdef OPACITY
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
if (vOpacityInfos.x==0.)
{vOpacityUV=vec2(opacityMatrix*vec4(uv,1.0,0.0));}
else
{vOpacityUV=vec2(opacityMatrix*vec4(uv2,1.0,0.0));}
#endif 
#include<clipPlaneVertex>
#include<logDepthVertex>
vPosition=position;vNormal=normal;
#if defined(HORIZON_FADE) || defined(BELOW_LINE_COLOR) || defined(ORIGIN_MARKER)
vWorldPos=worldPos.xyz;
#endif
#define CUSTOM_VERTEX_MAIN_END
}`;if(!e.ShadersStore[o])e.ShadersStore[o]=p;var m=[n,s,f,l,t,r,c,d,a,v];for(let i of m)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var h={name:o,shader:p};export{h as gridVertexShader};

//# debugId=377B7AF21647386B64756E2164756E21
//# sourceMappingURL=grid.vertex-sk9pp3vn.js.map
