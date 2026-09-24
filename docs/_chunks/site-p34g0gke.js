import{Cz as l}from"./site-b4abssv4.js";import{Gz as f}from"./site-5396gbjx.js";import{Qz as d}from"./site-fcc7k5fg.js";import{Rz as t}from"./site-2mbnfcv5.js";import{Sz as n}from"./site-htnx42ev.js";import{Tz as r}from"./site-aywapsn3.js";import{TC as e}from"./site-qntg4d3x.js";var i="skyVertexShader",a=`precision highp float;attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
uniform mat4 world;uniform mat4 view;uniform mat4 viewProjection;
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<logDepthDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
gl_Position=viewProjection*world*vec4(position,1.0);vec4 worldPos=world*vec4(position,1.0);vPositionW=vec3(worldPos);
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#ifdef VERTEXCOLOR
vColor=color;
#endif
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStore[i])e.ShadersStore[i]=a;var c=[f,r,t,n,l,d];for(let o of c)if(!e.IncludesShadersStore[o.name])e.IncludesShadersStore[o.name]=o.shader;var h={name:i,shader:a};
export{h as _f};

//# debugId=5E66919B4CF5385E64756E2164756E21
//# sourceMappingURL=site-p34g0gke.js.map
