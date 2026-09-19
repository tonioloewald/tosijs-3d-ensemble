import{RC as e}from"./site-eq33q5cn.js";var r="fresnelFunction",o=`#ifdef FRESNEL
fn computeFresnelTerm(viewDirection: vec3f,worldNormal: vec3f,bias: f32,power: f32)->f32
{let fresnelTerm: f32=pow(bias+abs(dot(viewDirection,worldNormal)),power);return clamp(fresnelTerm,0.,1.);}
#endif
`;if(!e.IncludesShadersStoreWGSL[r])e.IncludesShadersStoreWGSL[r]=o;var f={name:r,shader:o};
export{f as tA};

//# debugId=AD72E0DBCE84E7AF64756E2164756E21
//# sourceMappingURL=site-90xat37t.js.map
