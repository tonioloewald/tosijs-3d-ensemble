import{Ty as V}from"./site-g3a793zk.js";import{Uy as s}from"./site-fc9nq7ky.js";import{Vy as u}from"./site-adyw8afb.js";import{Wy as m}from"./site-s5bghf3e.js";import{Cz as v}from"./site-b4abssv4.js";import{Gz as p}from"./site-5396gbjx.js";import{Kz as n}from"./site-14avg1cz.js";import{Lz as d}from"./site-vzpq9esa.js";import{Mz as i,Nz as c}from"./site-a8g5nnxf.js";import{Oz as r}from"./site-adck33zp.js";import{Pz as l}from"./site-qq7x7ynn.js";import{Sz as f}from"./site-htnx42ev.js";import{Tz as a}from"./site-aywapsn3.js";import{TC as e}from"./site-qntg4d3x.js";var o="outlineVertexShader",x=`attribute vec3 position;attribute vec3 normal;
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
export{j as Ng};

//# debugId=625D93A1EF2AA64164756E2164756E21
//# sourceMappingURL=site-j5sgstn4.js.map
