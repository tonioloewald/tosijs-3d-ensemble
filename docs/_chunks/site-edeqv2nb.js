import{Ty as p}from"./site-g3a793zk.js";import{Uy as d}from"./site-fc9nq7ky.js";import{Vy as c}from"./site-adyw8afb.js";import{Wy as m}from"./site-s5bghf3e.js";import{Kz as a}from"./site-14avg1cz.js";import{Lz as n}from"./site-vzpq9esa.js";import{Mz as t,Nz as s}from"./site-a8g5nnxf.js";import{Oz as i}from"./site-adck33zp.js";import{Pz as l}from"./site-qq7x7ynn.js";import{TC as e}from"./site-qntg4d3x.js";var r="iblVoxelGridVertexShader",x=`attribute vec3 position;varying vec3 vNormalizedPosition;
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
export{_ as Di};

//# debugId=5EC2BC80C62F29BB64756E2164756E21
//# sourceMappingURL=site-edeqv2nb.js.map
