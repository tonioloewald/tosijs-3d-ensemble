import{Tz as i}from"./site-ym4sz14a.js";import{Uz as d}from"./site-ky8cdnt3.js";import{Vz as a}from"./site-fypy0ssm.js";import{Wz as n}from"./site-9re6xjgb.js";import{RC as e}from"./site-eq33q5cn.js";var r="colorPixelShader",l=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
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
export{C as Sz};

//# debugId=9CD3E22F7017B66564756E2164756E21
//# sourceMappingURL=site-0aagdbcf.js.map
