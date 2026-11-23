import{ee}from"./site-6tn24edh.js";import{i}from"./site-1yf4ncc8.js";var t="lodPixelShader",r=`#ifndef USE_EXACT_SRGB_CONVERSIONS
#define USE_EXACT_SRGB_CONVERSIONS
#endif
#include<helperFunctions>
varying vUV: vec2f;var textureSampler: texture_2d<f32>;uniform lod: f32;uniform gamma: i32; 
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let textureSize=textureDimensions(textureSampler);fragmentOutputs.color=textureLoad(textureSampler,vec2u(fragmentInputs.vUV*vec2f(textureSize)),u32(uniforms.lod));if (uniforms.gamma==0) {fragmentOutputs.color=vec4f(pow(fragmentOutputs.color.rgb,vec3f(GammaEncodePowerApprox)),fragmentOutputs.color.a);} else if (uniforms.gamma==2) {fragmentOutputs.color=vec4f(toGammaSpaceExact(fragmentOutputs.color.rgb),fragmentOutputs.color.a);}}
`;if(!i.ShadersStoreWGSL[t])i.ShadersStoreWGSL[t]=r;var o=[ee];for(let e of o)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var DR={name:t,shader:r};
export{DR};

//# debugId=569A2FD436CD1B3564756E2164756E21
//# sourceMappingURL=site-0c8senve.js.map
