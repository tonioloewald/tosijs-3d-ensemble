import{mB as t}from"./site-9kgzghsy.js";import{nB as a}from"./site-qyq8ndc8.js";import{oB as i}from"./site-2e2f7cy5.js";import{pB as o}from"./site-1nhd90ma.js";import{TC as e}from"./site-qntg4d3x.js";var r="colorPixelShader",f=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
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
}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=f;var d=[o,t,i,a];for(let n of d)if(!e.IncludesShadersStoreWGSL[n.name])e.IncludesShadersStoreWGSL[n.name]=n.shader;var u={name:r,shader:f};
export{u as lB};

//# debugId=64AAD7423CCCE1E364756E2164756E21
//# sourceMappingURL=site-6d8pq244.js.map
