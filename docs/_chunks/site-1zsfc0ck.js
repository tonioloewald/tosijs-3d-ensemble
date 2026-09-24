import{TC as e}from"./site-qntg4d3x.js";var r="fresnelFunction",o=`#ifdef FRESNEL
fn computeFresnelTerm(viewDirection: vec3f,worldNormal: vec3f,bias: f32,power: f32)->f32
{let fresnelTerm: f32=pow(bias+abs(dot(viewDirection,worldNormal)),power);return clamp(fresnelTerm,0.,1.);}
#endif
`;if(!e.IncludesShadersStoreWGSL[r])e.IncludesShadersStoreWGSL[r]=o;var f={name:r,shader:o};
export{f as vA};

//# debugId=FE4F679BD125192A64756E2164756E21
//# sourceMappingURL=site-1zsfc0ck.js.map
