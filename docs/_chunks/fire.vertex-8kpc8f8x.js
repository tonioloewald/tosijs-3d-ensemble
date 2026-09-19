import{Az as p}from"./site-2qj3m9e3.js";import{Ez as u}from"./site-qn42tyww.js";import{Hz as m}from"./site-zehpga8q.js";import{Iz as f}from"./site-9bjydj6j.js";import{Jz as a}from"./site-xf36gx1c.js";import{Kz as t,Lz as l}from"./site-s96bejdb.js";import{Mz as r}from"./site-j8wqv8am.js";import{Nz as c}from"./site-23881zbn.js";import{Oz as v}from"./site-zbp16tcx.js";import{Pz as d}from"./site-80rxy59e.js";import{Qz as s}from"./site-naexcj0b.js";import{Rz as n}from"./site-g67gdz3h.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="fireVertexShader",D=`precision highp float;attribute vec3 position;
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
varying vec2 vDiffuseUV;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
uniform float time;uniform float speed;
#ifdef DIFFUSE
varying vec2 vDistortionCoords1;varying vec2 vDistortionCoords2;varying vec2 vDistortionCoords3;
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
#ifdef DIFFUSE
vDiffuseUV=uv;vDiffuseUV.y-=0.2;
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<vertexColorMixing>
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#ifdef DIFFUSE
vec3 layerSpeed=vec3(-0.2,-0.52,-0.1)*speed;vDistortionCoords1.x=uv.x;vDistortionCoords1.y=uv.y+layerSpeed.x*time/1000.0;vDistortionCoords2.x=uv.x;vDistortionCoords2.y=uv.y+layerSpeed.y*time/1000.0;vDistortionCoords3.x=uv.x;vDistortionCoords3.y=uv.y+layerSpeed.z*time/1000.0;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStore[o])e.ShadersStore[o]=D;var x=[r,t,f,n,u,d,a,c,l,s,p,v,m];for(let i of x)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var F={name:o,shader:D};export{F as fireVertexShader};

//# debugId=559F1740D758F1EC64756E2164756E21
//# sourceMappingURL=fire.vertex-8kpc8f8x.js.map
