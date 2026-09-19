import{Ry as p}from"./site-pdwzhz4x.js";import{Sy as d}from"./site-j84429td.js";import{Ty as c}from"./site-dz7365y8.js";import{Uy as m}from"./site-5zdwhyeg.js";import{Iz as a}from"./site-9bjydj6j.js";import{Jz as n}from"./site-xf36gx1c.js";import{Kz as t,Lz as s}from"./site-s96bejdb.js";import{Mz as i}from"./site-j8wqv8am.js";import{Nz as l}from"./site-23881zbn.js";import{RC as e}from"./site-eq33q5cn.js";var r="iblVoxelGridVertexShader",x=`attribute vec3 position;varying vec3 vNormalizedPosition;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
uniform mat4 invWorldScale;uniform mat4 viewMatrix;void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);gl_Position=viewMatrix*invWorldScale*worldPos;vNormalizedPosition.xyz=gl_Position.xyz*0.5+0.5;
#ifdef IS_NDC_HALF_ZRANGE
gl_Position.z=gl_Position.z*0.5+0.5;
#endif
}`;if(!e.ShadersStore[r])e.ShadersStore[r]=x;var f=[i,t,a,m,d,c,p,n,l,s];for(let o of f)if(!e.IncludesShadersStore[o.name])e.IncludesShadersStore[o.name]=o.shader;var _={name:r,shader:x};
export{_ as Bi};

//# debugId=DF501DE58F4DBF4464756E2164756E21
//# sourceMappingURL=site-paj1gvvz.js.map
