import{yz as l}from"./site-cd6d8e0s.js";import{Gz as a}from"./site-5396gbjx.js";import{Xz as i}from"./site-4a1hf6nf.js";import{Yz as o}from"./site-qy8vh6e0.js";import{TC as e}from"./site-qntg4d3x.js";var n="linePixelShader",t=`#include<clipPlaneFragmentDeclaration>
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
export{s as Tg};

//# debugId=DD565D0619E0F7CE64756E2164756E21
//# sourceMappingURL=site-ncvt6ew1.js.map
