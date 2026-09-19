import{Ey as h}from"./site-eg004nz3.js";import{Ry as x}from"./site-pdwzhz4x.js";import{Sy as V}from"./site-j84429td.js";import{Ty as v}from"./site-dz7365y8.js";import{Uy as u}from"./site-5zdwhyeg.js";import{Iz as f}from"./site-9bjydj6j.js";import{Jz as c}from"./site-xf36gx1c.js";import{Kz as d,Lz as m}from"./site-s96bejdb.js";import{Mz as a}from"./site-j8wqv8am.js";import{Nz as s}from"./site-23881zbn.js";import{Qz as p}from"./site-naexcj0b.js";import{Rz as l}from"./site-g67gdz3h.js";import{RC as e}from"./site-eq33q5cn.js";var t="pointCloudVertexDeclaration",o=`#ifdef POINTSIZE
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
export{G as Ej};

//# debugId=57871E3F1D8B024064756E2164756E21
//# sourceMappingURL=site-jg35gwgf.js.map
