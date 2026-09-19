import{Ry as p}from"./site-pdwzhz4x.js";import{Sy as c}from"./site-j84429td.js";import{Ty as s}from"./site-dz7365y8.js";import{Uy as d}from"./site-5zdwhyeg.js";import{Iz as n}from"./site-9bjydj6j.js";import{Jz as i}from"./site-xf36gx1c.js";import{Kz as t,Lz as l}from"./site-s96bejdb.js";import{Mz as a}from"./site-j8wqv8am.js";import{Nz as m}from"./site-23881zbn.js";import{RC as e}from"./site-eq33q5cn.js";var o="meshUVSpaceRendererVertexShader",S=`precision highp float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 projMatrix;varying vec2 vDecalTC;
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
export{D as th};

//# debugId=077A4732E0AA2DC464756E2164756E21
//# sourceMappingURL=site-48v70k1g.js.map
