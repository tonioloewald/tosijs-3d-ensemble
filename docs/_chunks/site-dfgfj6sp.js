import{wz as l}from"./site-njq9fpyp.js";import{Ez as a}from"./site-qn42tyww.js";import{Vz as i}from"./site-fypy0ssm.js";import{Wz as o}from"./site-9re6xjgb.js";import{RC as e}from"./site-eq33q5cn.js";var n="linePixelShader",t=`#include<clipPlaneFragmentDeclaration>
uniform vec4 color;
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStore[n])e.ShadersStore[n]=t;var c=[o,a,l,i];for(let r of c)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var s={name:n,shader:t};
export{s as Rg};

//# debugId=49427A35843BC04364756E2164756E21
//# sourceMappingURL=site-dfgfj6sp.js.map
