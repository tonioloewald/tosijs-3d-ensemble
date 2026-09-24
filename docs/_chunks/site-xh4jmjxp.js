import{Ty as l}from"./site-g3a793zk.js";import{Uy as s}from"./site-fc9nq7ky.js";import{Vy as m}from"./site-adyw8afb.js";import{Wy as c}from"./site-s5bghf3e.js";import{Kz as n}from"./site-14avg1cz.js";import{Lz as a}from"./site-vzpq9esa.js";import{Mz as o,Nz as f}from"./site-a8g5nnxf.js";import{Oz as r}from"./site-adck33zp.js";import{Pz as d}from"./site-qq7x7ynn.js";import{TC as e}from"./site-qntg4d3x.js";var t="volumetricLightScatteringPassVertexShader",u=`attribute vec3 position;
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
export{A as _g};

//# debugId=180EDE8337FCE2D364756E2164756E21
//# sourceMappingURL=site-xh4jmjxp.js.map
