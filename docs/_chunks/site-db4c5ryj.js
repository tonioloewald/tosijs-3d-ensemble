import{TC as e}from"./site-qntg4d3x.js";var r="boundingBoxRendererPixelShader",n=`uniform color: vec4f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=n;var t={name:r,shader:n};
export{t as bh};

//# debugId=22C3363EC14B21B064756E2164756E21
//# sourceMappingURL=site-db4c5ryj.js.map
