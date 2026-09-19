import{RC as e}from"./site-eq33q5cn.js";var r="meshUVSpaceRendererPixelShader",t=`varying vDecalTC: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {if (input.vDecalTC.x<0. || input.vDecalTC.x>1. || input.vDecalTC.y<0. || input.vDecalTC.y>1.) {discard;}
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vDecalTC);}
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=t;var p={name:r,shader:t};
export{p as Eh};

//# debugId=64F9C43E2AF4558E64756E2164756E21
//# sourceMappingURL=site-0d6gsrzw.js.map
