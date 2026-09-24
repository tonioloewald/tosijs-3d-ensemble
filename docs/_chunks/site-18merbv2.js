import{Gy as h}from"./site-yt9z7342.js";import{Ty as x}from"./site-g3a793zk.js";import{Uy as V}from"./site-fc9nq7ky.js";import{Vy as v}from"./site-adyw8afb.js";import{Wy as u}from"./site-s5bghf3e.js";import{Kz as f}from"./site-14avg1cz.js";import{Lz as c}from"./site-vzpq9esa.js";import{Mz as d,Nz as m}from"./site-a8g5nnxf.js";import{Oz as a}from"./site-adck33zp.js";import{Pz as s}from"./site-qq7x7ynn.js";import{Sz as p}from"./site-htnx42ev.js";import{Tz as l}from"./site-aywapsn3.js";import{TC as e}from"./site-qntg4d3x.js";var t="pointCloudVertexDeclaration",o=`#ifdef POINTSIZE
uniform float pointSize;
#endif
`;if(!e.IncludesShadersStore[t])e.IncludesShadersStore[t]=o;var n={name:t,shader:o};var r="depthVertexShader",S=`attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform mat4 viewProjection;uniform vec2 depthValues;
#if defined(ALPHATEST) || defined(NEED_UV)
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
uniform mat4 view;varying vec4 vViewPos;
#endif
#include<pointCloudVertexDeclaration>
varying float vDepthMetric;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
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
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#include<clipPlaneVertex>
gl_Position=viewProjection*worldPos;
#ifdef STORE_CAMERASPACE_Z
vViewPos=view*worldPos;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric=((-gl_Position.z+depthValues.x)/(depthValues.y));
#else
vDepthMetric=((gl_Position.z+depthValues.x)/(depthValues.y));
#endif
#endif
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<pointCloudVertex>
}
`;if(!e.ShadersStore[r])e.ShadersStore[r]=S;var D=[a,d,u,V,l,f,n,v,x,c,s,m,p,h];for(let i of D)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var G={name:r,shader:S};
export{G as Gj};

//# debugId=50A30D8E00DA0FB364756E2164756E21
//# sourceMappingURL=site-18merbv2.js.map
