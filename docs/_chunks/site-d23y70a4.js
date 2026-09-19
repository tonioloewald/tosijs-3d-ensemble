import{zl as a}from"./site-h3jjyybe.js";import{RC as e}from"./site-eq33q5cn.js";var t="kernelBlurVertex",o="vertexOutputs.sampleCoord{X}=vertexOutputs.sampleCenter+uniforms.delta*KERNEL_OFFSET{X};";if(!e.IncludesShadersStoreWGSL[t])e.IncludesShadersStoreWGSL[t]=o;var s={name:t,shader:o};var n="kernelBlurVertexShader",i=`attribute position: vec2f;uniform delta: vec2f;varying sampleCenter: vec2f;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.sampleCenter=(vertexInputs.position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
vertexOutputs.position= vec4f(vertexInputs.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;if(!e.ShadersStoreWGSL[n])e.ShadersStoreWGSL[n]=i;var u=[a,s];for(let r of u)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var p={name:n,shader:i};
export{p as yl};

//# debugId=882DF598D648B18264756E2164756E21
//# sourceMappingURL=site-d23y70a4.js.map
