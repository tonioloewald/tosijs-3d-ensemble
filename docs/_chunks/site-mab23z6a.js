import{RC as e}from"./site-eq33q5cn.js";var r="fresnelFunction",o=`#ifdef FRESNEL
float computeFresnelTerm(vec3 viewDirection,vec3 worldNormal,float bias,float power)
{float fresnelTerm=pow(bias+abs(dot(viewDirection,worldNormal)),power);return clamp(fresnelTerm,0.,1.);}
#endif
`;if(!e.IncludesShadersStore[r])e.IncludesShadersStore[r]=o;var t={name:r,shader:o};
export{t as Wy};

//# debugId=5CEC4D659E4BA40F64756E2164756E21
//# sourceMappingURL=site-mab23z6a.js.map
