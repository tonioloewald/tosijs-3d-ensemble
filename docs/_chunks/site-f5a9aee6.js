import{RC as e}from"./site-eq33q5cn.js";var r="areaLightTextureProcessingPixelShader",a=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform scalingRange: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let x: f32=(input.vUV.x-uniforms.scalingRange.x)/(uniforms.scalingRange.y-uniforms.scalingRange.x);let y: f32=(input.vUV.y-uniforms.scalingRange.x)/(uniforms.scalingRange.y-uniforms.scalingRange.x);let scaledUV: vec2f=vec2f(x,y);fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,scaledUV);}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=a;var n={name:r,shader:a};
export{n as ph};

//# debugId=E9F7FBFB2431699C64756E2164756E21
//# sourceMappingURL=site-f5a9aee6.js.map
