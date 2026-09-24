import{Ty as p}from"./site-g3a793zk.js";import{Uy as c}from"./site-fc9nq7ky.js";import{Vy as s}from"./site-adyw8afb.js";import{Wy as d}from"./site-s5bghf3e.js";import{Kz as n}from"./site-14avg1cz.js";import{Lz as i}from"./site-vzpq9esa.js";import{Mz as t,Nz as l}from"./site-a8g5nnxf.js";import{Oz as a}from"./site-adck33zp.js";import{Pz as m}from"./site-qq7x7ynn.js";import{TC as e}from"./site-qntg4d3x.js";var o="meshUVSpaceRendererVertexShader",S=`precision highp float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 projMatrix;varying vec2 vDecalTC;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
void main(void) {vec3 positionUpdated=position;vec3 normalUpdated=normal;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);mat3 normWorldSM=mat3(finalWorld);vec3 vNormalW;
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vNormalW=normalize(normWorldSM*normalUpdated);
#endif
vec3 normalView=normalize((projMatrix*vec4(vNormalW,0.0)).xyz);vec3 decalTC=(projMatrix*worldPos).xyz;vDecalTC=decalTC.xy;gl_Position=vec4(uv*2.0-1.0,normalView.z>0.0 ? 2. : decalTC.z,1.0);}`;if(!e.ShadersStore[o])e.ShadersStore[o]=S;var v=[a,t,d,c,n,s,p,i,m,l];for(let r of v)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var D={name:o,shader:S};
export{D as vh};

//# debugId=772FF798BD4D645564756E2164756E21
//# sourceMappingURL=site-szs17rga.js.map
