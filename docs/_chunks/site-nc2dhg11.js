import{Me,Ee}from"./site-qtq2tkrz.js";import{rt,ot}from"./site-m57amydx.js";import{i}from"./site-1yf4ncc8.js";var o="colorPixelShader",r=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
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
}`;if(!i.ShadersStore[o])i.ShadersStore[o]=r;var n=[Me,rt,Ee,ot];for(let e of n)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var UT={name:o,shader:r};
export{UT};

//# debugId=2605873B767D7B2264756E2164756E21
//# sourceMappingURL=site-nc2dhg11.js.map
