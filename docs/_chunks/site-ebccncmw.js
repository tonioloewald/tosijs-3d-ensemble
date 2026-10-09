import{xe,ve}from"./site-t5na8t3j.js";import{Je,je}from"./site-zf1vhhrw.js";import{i}from"./site-1yf4ncc8.js";var n="colorPixelShader",r=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
#define VERTEXCOLOR
varying vColor: vec4f;
#else
uniform color: vec4f;
#endif
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
fragmentOutputs.color=input.vColor;
#else
fragmentOutputs.color=uniforms.color;
#endif
#include<fogFragment>(color,fragmentOutputs.color)
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!i.ShadersStoreWGSL[n])i.ShadersStoreWGSL[n]=r;var o=[xe,Je,ve,je];for(let e of o)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var zT={name:n,shader:r};
export{zT};

//# debugId=F7E7C912E22F09A264756E2164756E21
//# sourceMappingURL=site-ebccncmw.js.map
