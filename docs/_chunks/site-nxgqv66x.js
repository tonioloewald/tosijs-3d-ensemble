import{RC as r}from"./site-eq33q5cn.js";var e="bloomMergePixelShader",o=`uniform sampler2D textureSampler;uniform sampler2D bloomBlur;varying vec2 vUV;uniform float bloomWeight;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(textureSampler,vUV);vec3 blurred=texture2D(bloomBlur,vUV).rgb;gl_FragColor.rgb=gl_FragColor.rgb+(blurred.rgb*bloomWeight); }
`;if(!r.ShadersStore[e])r.ShadersStore[e]=o;var t={name:e,shader:o};
export{t as ll};

//# debugId=EA46EBE66074FA3364756E2164756E21
//# sourceMappingURL=site-nxgqv66x.js.map
