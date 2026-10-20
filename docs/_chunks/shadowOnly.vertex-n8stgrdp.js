import{Fe,ze,Te,Se,ke,Ge}from"./site-4bdbqgnd.js";import{Rs}from"./site-caa0j6xj.js";import{yt}from"./site-ngk6phyz.js";import{Oe,Ce}from"./site-52sy01sv.js";import{H}from"./site-rze70emw.js";import{ot,mt}from"./site-ry6aaypv.js";import{Ie,Me}from"./site-tsmvvksm.js";import{tt}from"./site-09wj8me1.js";import{qt}from"./site-39j98gas.js";import{i}from"./site-1yf4ncc8.js";var o="shadowOnlyVertexShader",r=`precision highp float;attribute vec3 position;
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
`;if(!i.ShadersStore[o])i.ShadersStore[o]=r;var n=[Fe,ze,Te,Rs,yt,Oe,H,ot,Ie,Me,Se,ke,Ge,Ce,tt,mt,qt];for(let e of n)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var T={name:o,shader:r};export{T as shadowOnlyVertexShader};

//# debugId=DE54232144428C3764756E2164756E21
//# sourceMappingURL=shadowOnly.vertex-n8stgrdp.js.map
