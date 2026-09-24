import{yz as t}from"./site-cd6d8e0s.js";import{Gz as a}from"./site-5396gbjx.js";import{Xz as o}from"./site-4a1hf6nf.js";import{Yz as n}from"./site-qy8vh6e0.js";import{TC as e}from"./site-qntg4d3x.js";var i="outlinePixelShader",l=`#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform vec4 color;
#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#include<logDepthFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStore[i])e.ShadersStore[i]=l;var d=[n,a,o,t];for(let r of d)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var p={name:i,shader:l};
export{p as Mg};

//# debugId=CF3E0034DE8C058364756E2164756E21
//# sourceMappingURL=site-6b85pbtr.js.map
