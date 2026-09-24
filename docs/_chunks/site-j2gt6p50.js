import{TC as e}from"./site-qntg4d3x.js";var r="fresnelFunction",o=`#ifdef FRESNEL
float computeFresnelTerm(vec3 viewDirection,vec3 worldNormal,float bias,float power)
{float fresnelTerm=pow(bias+abs(dot(viewDirection,worldNormal)),power);return clamp(fresnelTerm,0.,1.);}
#endif
`;if(!e.IncludesShadersStore[r])e.IncludesShadersStore[r]=o;var t={name:r,shader:o};
export{t as Yy};

//# debugId=CFFACD0042E2AFE064756E2164756E21
//# sourceMappingURL=site-j2gt6p50.js.map
