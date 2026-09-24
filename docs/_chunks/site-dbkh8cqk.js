import{Ty as p}from"./site-g3a793zk.js";import{Uy as c}from"./site-fc9nq7ky.js";import{Vy as l}from"./site-adyw8afb.js";import{Wy as m}from"./site-s5bghf3e.js";import{Kz as n}from"./site-14avg1cz.js";import{Lz as a}from"./site-vzpq9esa.js";import{Mz as i,Nz as d}from"./site-a8g5nnxf.js";import{Oz as t}from"./site-adck33zp.js";import{Pz as s}from"./site-qq7x7ynn.js";import{TC as e}from"./site-qntg4d3x.js";var o="pickingVertexShader",f=`attribute vec3 position;
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
export{k as _w};

//# debugId=1D7DD06FF2278D9764756E2164756E21
//# sourceMappingURL=site-dbkh8cqk.js.map
