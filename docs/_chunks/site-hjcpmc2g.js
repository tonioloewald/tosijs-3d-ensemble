import{wz as t}from"./site-njq9fpyp.js";import{Ez as a}from"./site-qn42tyww.js";import{Vz as o}from"./site-fypy0ssm.js";import{Wz as n}from"./site-9re6xjgb.js";import{RC as e}from"./site-eq33q5cn.js";var i="outlinePixelShader",l=`#ifdef LOGARITHMICDEPTH
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
export{p as Kg};

//# debugId=117B12006F6E63CA64756E2164756E21
//# sourceMappingURL=site-hjcpmc2g.js.map
