import{OA as i}from"./site-7611pkz2.js";import{SA as a}from"./site-tvsjdjzy.js";import{mB as o}from"./site-v9zm9412.js";import{nB as t}from"./site-yjav6xay.js";import{RC as e}from"./site-eq33q5cn.js";var r="linePixelShader",l=`#include<clipPlaneFragmentDeclaration>
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
export{s as Pg};

//# debugId=945C2D73B08A359D64756E2164756E21
//# sourceMappingURL=site-3kc1zjsf.js.map
