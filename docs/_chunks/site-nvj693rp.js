import{RC as e}from"./site-eq33q5cn.js";var r="boundingBoxRendererPixelShader",n=`uniform color: vec4f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=n;var t={name:r,shader:n};
export{t as $g};

//# debugId=82F84C6AA6ECAA8764756E2164756E21
//# sourceMappingURL=site-nvj693rp.js.map
