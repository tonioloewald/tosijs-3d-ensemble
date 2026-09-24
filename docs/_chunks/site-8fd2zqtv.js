import{hj as t,ij as c}from"./site-fre27gc9.js";import{Bk as o}from"./site-g6vx6yh5.js";import{Dz as n}from"./site-231618cv.js";import{TC as r}from"./site-qntg4d3x.js";var i="hdrFilteringPixelShader",a=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform float alphaG;uniform samplerCube inputTexture;uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=radiance(alphaG,inputTexture,direction,vFilteringInfo);gl_FragColor=vec4(color*hdrScale,1.0);}`;if(!r.ShadersStore[i])r.ShadersStore[i]=a;var l=[n,t,o,c];for(let e of l)if(!r.IncludesShadersStore[e.name])r.IncludesShadersStore[e.name]=e.shader;var p={name:i,shader:a};
export{p as Zh};

//# debugId=1FE134841777424964756E2164756E21
//# sourceMappingURL=site-8fd2zqtv.js.map
