import{fj as t,gj as c}from"./site-920zktcm.js";import{zk as o}from"./site-pt6ep2dk.js";import{Bz as n}from"./site-chw2k88q.js";import{RC as r}from"./site-eq33q5cn.js";var i="hdrIrradianceFilteringPixelShader",d=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform samplerCube inputTexture;
#ifdef IBL_CDF_FILTERING
uniform sampler2D icdfTexture;
#endif
uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=irradiance(inputTexture,direction,vFilteringInfo,0.0,vec3(1.0),direction
#ifdef IBL_CDF_FILTERING
,icdfTexture
#endif
);gl_FragColor=vec4(color*hdrScale,1.0);}`;if(!r.ShadersStore[i])r.ShadersStore[i]=d;var a=[n,t,o,c];for(let e of a)if(!r.IncludesShadersStore[e.name])r.IncludesShadersStore[e.name]=e.shader;var F={name:i,shader:d};
export{F as Mh};

//# debugId=90A0CF807B06AAC964756E2164756E21
//# sourceMappingURL=site-6mg1rcs1.js.map
