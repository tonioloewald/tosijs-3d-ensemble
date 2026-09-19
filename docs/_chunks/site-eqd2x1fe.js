import{RC as e}from"./site-eq33q5cn.js";var r="iblCdfxPixelShader",t=`#define PI 3.1415927
varying vUV: vec2f;var cdfy: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var cdfyRes=textureDimensions(cdfy,0);var currentPixel=vec2u(fragmentInputs.position.xy);var cdfx: f32=0.0;for (var x: u32=1; x<=currentPixel.x; x++) {cdfx+=textureLoad(cdfy, vec2u(x-1,cdfyRes.y-1),0).x;}
fragmentOutputs.color= vec4f( vec3f(cdfx),1.0);}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=t;var n={name:r,shader:t};
export{n as Ci};

//# debugId=C03E9E09C3FF8F7264756E2164756E21
//# sourceMappingURL=site-eqd2x1fe.js.map
