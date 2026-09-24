import{rk as s}from"./site-ptk3bhbp.js";import{Cz as v}from"./site-b4abssv4.js";import{Fz as f}from"./site-2zvtkt7b.js";import{Gz as l}from"./site-5396gbjx.js";import{Kz as n}from"./site-14avg1cz.js";import{Lz as c}from"./site-vzpq9esa.js";import{Qz as d}from"./site-fcc7k5fg.js";import{Rz as t}from"./site-2mbnfcv5.js";import{Sz as a}from"./site-htnx42ev.js";import{Tz as r}from"./site-aywapsn3.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var o="gridVertexShader",p=`precision highp float;attribute vec3 position;attribute vec3 normal;
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

//# debugId=94DBB191EEFBD29364756E2164756E21
//# sourceMappingURL=grid.vertex-3909dx99.js.map
