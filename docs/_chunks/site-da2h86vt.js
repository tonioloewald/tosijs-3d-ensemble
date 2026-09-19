import{Ry as V}from"./site-pdwzhz4x.js";import{Sy as s}from"./site-j84429td.js";import{Ty as u}from"./site-dz7365y8.js";import{Uy as m}from"./site-5zdwhyeg.js";import{Az as v}from"./site-2qj3m9e3.js";import{Ez as p}from"./site-qn42tyww.js";import{Iz as n}from"./site-9bjydj6j.js";import{Jz as d}from"./site-xf36gx1c.js";import{Kz as i,Lz as c}from"./site-s96bejdb.js";import{Mz as r}from"./site-j8wqv8am.js";import{Nz as l}from"./site-23881zbn.js";import{Qz as f}from"./site-naexcj0b.js";import{Rz as a}from"./site-g67gdz3h.js";import{RC as e}from"./site-eq33q5cn.js";var o="outlineVertexShader",x=`attribute vec3 position;attribute vec3 normal;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
uniform float offset;
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef ALPHATEST
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;vec3 normalUpdated=normal;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
vec3 offsetPosition=positionUpdated+(normalUpdated*offset);
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(offsetPosition,1.0);gl_Position=viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
}
`;if(!e.ShadersStore[o])e.ShadersStore[o]=x;var h=[r,i,m,s,a,n,p,u,V,d,l,c,f,v];for(let t of h)if(!e.IncludesShadersStore[t.name])e.IncludesShadersStore[t.name]=t.shader;var j={name:o,shader:x};
export{j as Lg};

//# debugId=5E415A3A46A340D664756E2164756E21
//# sourceMappingURL=site-da2h86vt.js.map
