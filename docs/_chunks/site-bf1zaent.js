import{Ry as p}from"./site-pdwzhz4x.js";import{Sy as c}from"./site-j84429td.js";import{Ty as l}from"./site-dz7365y8.js";import{Uy as m}from"./site-5zdwhyeg.js";import{Iz as n}from"./site-9bjydj6j.js";import{Jz as a}from"./site-xf36gx1c.js";import{Kz as i,Lz as d}from"./site-s96bejdb.js";import{Mz as t}from"./site-j8wqv8am.js";import{Nz as s}from"./site-23881zbn.js";import{RC as e}from"./site-eq33q5cn.js";var o="pickingVertexShader",f=`attribute vec3 position;
#if defined(INSTANCES)
attribute float instanceMeshID;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform mat4 viewProjection;
#if defined(INSTANCES)
flat varying float vMeshID;
#endif
void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);gl_Position=viewProjection*worldPos;
#if defined(INSTANCES)
vMeshID=instanceMeshID;
#endif
}
`;if(!e.ShadersStore[o])e.ShadersStore[o]=f;var h=[t,i,m,c,n,l,p,a,s,d];for(let r of h)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var k={name:o,shader:f};
export{k as Yw};

//# debugId=027C928B913D572064756E2164756E21
//# sourceMappingURL=site-bf1zaent.js.map
