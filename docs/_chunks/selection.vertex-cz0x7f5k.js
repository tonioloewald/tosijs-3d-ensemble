import{Ty as u}from"./site-g3a793zk.js";import{Uy as m}from"./site-fc9nq7ky.js";import{Vy as p}from"./site-adyw8afb.js";import{Wy as s}from"./site-s5bghf3e.js";import{Kz as a}from"./site-14avg1cz.js";import{Lz as d}from"./site-vzpq9esa.js";import{Mz as o,Nz as l}from"./site-a8g5nnxf.js";import{Oz as r}from"./site-adck33zp.js";import{Pz as f}from"./site-qq7x7ynn.js";import{Sz as c}from"./site-htnx42ev.js";import{Tz as n}from"./site-aywapsn3.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var t="selectionVertexShader",v=`attribute vec3 position;
#ifdef INSTANCES
attribute float instanceSelectionId;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef STORE_CAMERASPACE_Z
uniform mat4 view;
#else
uniform vec2 depthValues;
#endif
#ifdef INSTANCES
flat varying float vSelectionId;
#endif
#ifdef STORE_CAMERASPACE_Z
varying float vViewPosZ;
#else
varying float vDepthMetric;
#endif
#ifdef ALPHATEST
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);gl_Position=viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
vViewPosZ=(view*worldPos).z;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric=((-gl_Position.z+depthValues.x)/(depthValues.y));
#else
vDepthMetric=((gl_Position.z+depthValues.x)/(depthValues.y));
#endif
#endif
#ifdef INSTANCES
vSelectionId=instanceSelectionId;
#endif
#include<clipPlaneVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStore[t])e.ShadersStore[t]=v;var V=[r,o,s,m,n,a,p,u,d,f,l,c];for(let i of V)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var I={name:t,shader:v};export{I as selectionVertexShader};

//# debugId=930BDCA02F986A0F64756E2164756E21
//# sourceMappingURL=selection.vertex-cz0x7f5k.js.map
