import{RC as e}from"./site-eq33q5cn.js";var t="clusteredLightingFunctions",i=`struct ClusteredLight {vec4 vLightData;vec4 vLightDiffuse;vec4 vLightSpecular;vec4 vLightDirection;vec4 vLightFalloff;};
#define inline
ClusteredLight getClusteredLight(sampler2D lightDataTexture,int index) {return ClusteredLight(
texelFetch(lightDataTexture,ivec2(0,index),0),
texelFetch(lightDataTexture,ivec2(1,index),0),
texelFetch(lightDataTexture,ivec2(2,index),0),
texelFetch(lightDataTexture,ivec2(3,index),0),
texelFetch(lightDataTexture,ivec2(4,index),0)
);}
int getClusteredSliceIndex(vec2 sliceData,float viewDepth) {return int(log(viewDepth)*sliceData.x+sliceData.y);}
`;if(!e.IncludesShadersStore[t])e.IncludesShadersStore[t]=i;var l={name:t,shader:i};
export{l as _y};

//# debugId=6EC2EFDBA290E3A964756E2164756E21
//# sourceMappingURL=site-h0y6wy85.js.map
