import{hj as t,ij as c}from"./site-fre27gc9.js";import{Bk as o}from"./site-g6vx6yh5.js";import{Dz as n}from"./site-231618cv.js";import{TC as r}from"./site-qntg4d3x.js";var i="hdrIrradianceFilteringPixelShader",d=`#include<helperFunctions>
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
export{F as Oh};

//# debugId=CB215AC11D522D9564756E2164756E21
//# sourceMappingURL=site-9dxbzqzd.js.map
