import{kB as t}from"./site-3k38km0y.js";import{lB as a}from"./site-zxff350y.js";import{mB as i}from"./site-v9zm9412.js";import{nB as o}from"./site-yjav6xay.js";import{RC as e}from"./site-eq33q5cn.js";var r="colorPixelShader",f=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
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
export{u as jB};

//# debugId=A058B93123E7830864756E2164756E21
//# sourceMappingURL=site-sghjddme.js.map
