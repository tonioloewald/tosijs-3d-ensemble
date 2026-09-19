import{Ry as l}from"./site-pdwzhz4x.js";import{Sy as s}from"./site-j84429td.js";import{Ty as m}from"./site-dz7365y8.js";import{Uy as c}from"./site-5zdwhyeg.js";import{Iz as n}from"./site-9bjydj6j.js";import{Jz as a}from"./site-xf36gx1c.js";import{Kz as o,Lz as f}from"./site-s96bejdb.js";import{Mz as r}from"./site-j8wqv8am.js";import{Nz as d}from"./site-23881zbn.js";import{RC as e}from"./site-eq33q5cn.js";var t="volumetricLightScatteringPassVertexShader",u=`attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
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
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#if (defined(ALPHATEST) || defined(NEED_UV)) && defined(UV1)
vec2 uvUpdated=uv;
#endif
#if (defined(ALPHATEST) || defined(NEED_UV)) && defined(UV2)
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
gl_Position=viewProjection*finalWorld*vec4(positionUpdated,1.0);
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
}
`;if(!e.ShadersStore[t])e.ShadersStore[t]=u;var p=[r,o,c,s,n,m,l,a,d,f];for(let i of p)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var A={name:t,shader:u};
export{A as Yg};

//# debugId=8E1646DADBD26E7864756E2164756E21
//# sourceMappingURL=site-t5rb2fq5.js.map
