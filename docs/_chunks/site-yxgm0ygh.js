import{eh as i}from"./site-2jgpqkx9.js";import{TC as e}from"./site-qntg4d3x.js";var o="boundingBoxRendererFragmentDeclaration",d=`uniform vec4 color;
`;if(!e.IncludesShadersStore[o])e.IncludesShadersStore[o]=d;var a={name:o,shader:d};var n="boundingBoxRendererPixelShader",t=`#include<__decl__boundingBoxRendererFragment>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStore[n])e.ShadersStore[n]=t;var c=[a,i];for(let r of c)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var f={name:n,shader:t};
export{f as dh};

//# debugId=6E0EA80C8809418864756E2164756E21
//# sourceMappingURL=site-yxgm0ygh.js.map
