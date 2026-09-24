import{TC as t}from"./site-qntg4d3x.js";var e="oitBackBlendPixelShader",r=`var uBackColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureLoad(uBackColor,vec2i(fragmentInputs.position.xy),0);if (fragmentOutputs.color.a==0.0) {discard;}}
`;if(!t.ShadersStoreWGSL[e])t.ShadersStoreWGSL[e]=r;var o={name:e,shader:r};
export{o as Zm};

//# debugId=7478DA0E094E494E64756E2164756E21
//# sourceMappingURL=site-e8za0zyd.js.map
