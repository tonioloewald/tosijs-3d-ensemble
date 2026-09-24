import{QA as i}from"./site-0ma0ypye.js";import{UA as a}from"./site-pxptatb5.js";import{oB as o}from"./site-2e2f7cy5.js";import{pB as t}from"./site-1nhd90ma.js";import{TC as e}from"./site-qntg4d3x.js";var r="linePixelShader",l=`#include<clipPlaneFragmentDeclaration>
uniform color: vec4f;
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=l;var m=[t,a,i,o];for(let n of m)if(!e.IncludesShadersStoreWGSL[n.name])e.IncludesShadersStoreWGSL[n.name]=n.shader;var s={name:r,shader:l};
export{s as Rg};

//# debugId=1BA42D5545C2E78864756E2164756E21
//# sourceMappingURL=site-xc9k71cf.js.map
