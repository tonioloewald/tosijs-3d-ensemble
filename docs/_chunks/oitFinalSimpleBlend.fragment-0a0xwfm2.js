import{TC as r}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var o="oitFinalSimpleBlendPixelShader",t=`var uFrontColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var frontColor: vec4f=textureLoad(uFrontColor,fragCoord,0);fragmentOutputs.color=frontColor;}
`;if(!r.ShadersStoreWGSL[o])r.ShadersStoreWGSL[o]=t;var n={name:o,shader:t};export{n as oitFinalSimpleBlendPixelShaderWGSL};

//# debugId=19A34366F13573A764756E2164756E21
//# sourceMappingURL=oitFinalSimpleBlend.fragment-0a0xwfm2.js.map
