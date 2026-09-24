import{Vz as i}from"./site-bdxc68pn.js";import{Wz as d}from"./site-dhab8phj.js";import{Xz as a}from"./site-4a1hf6nf.js";import{Yz as n}from"./site-qy8vh6e0.js";import{TC as e}from"./site-qntg4d3x.js";var r="colorPixelShader",l=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
#define VERTEXCOLOR
varying vec4 vColor;
#else
uniform vec4 color;
#endif
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
gl_FragColor=vColor;
#else
gl_FragColor=color;
#endif
#include<fogFragment>(color,gl_FragColor)
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStore[r])e.ShadersStore[r]=l;var c=[n,i,a,d];for(let o of c)if(!e.IncludesShadersStore[o.name])e.IncludesShadersStore[o.name]=o.shader;var C={name:r,shader:l};
export{C as Uz};

//# debugId=C7450D27B0C59C1D64756E2164756E21
//# sourceMappingURL=site-dzc8bf89.js.map
