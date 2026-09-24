import{TC as e}from"./site-qntg4d3x.js";var o="sceneUboDeclaration",n=`struct Scene {viewProjection : mat4x4<f32>,
#ifdef MULTIVIEW
viewProjectionR : mat4x4<f32>,
#endif 
view : mat4x4<f32>,
projection : mat4x4<f32>,
vEyePosition : vec4<f32>,
inverseProjection : mat4x4<f32>,};
#define SCENE_UBO
var<uniform> scene : Scene;
`;if(!e.IncludesShadersStoreWGSL[o])e.IncludesShadersStoreWGSL[o]=n;var r={name:o,shader:n};
export{r as WA};

//# debugId=0F9CEA9252755DD364756E2164756E21
//# sourceMappingURL=site-mevm09sp.js.map
