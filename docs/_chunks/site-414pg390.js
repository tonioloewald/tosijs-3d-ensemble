import{RC as e}from"./site-eq33q5cn.js";var r="sharpenPixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform screenSize: vec2f;uniform sharpnessAmounts: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var onePixel: vec2f= vec2f(1.0,1.0)/uniforms.screenSize;var color: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);var edgeDetection: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(0,-1)) +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(-1,0)) +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(1,0)) +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(0,1)) -
color*4.0;fragmentOutputs.color=max(vec4f(color.rgb*uniforms.sharpnessAmounts.y,color.a)-(uniforms.sharpnessAmounts.x* vec4f(edgeDetection.rgb,0)),vec4f(0.));}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=t;var m={name:r,shader:t};
export{m as Tk};

//# debugId=9105632E983FDF5064756E2164756E21
//# sourceMappingURL=site-414pg390.js.map
