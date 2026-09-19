import{oz as n}from"./site-p2c2gt72.js";import{pz as o}from"./site-dc2h7ssr.js";import{Bz as s}from"./site-chw2k88q.js";import{RC as e}from"./site-eq33q5cn.js";var i="imageProcessingPixelShader",t=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 result=texture2D(textureSampler,vUV);result.rgb=max(result.rgb,vec3(0.));
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result.rgb=toLinearSpace(result.rgb);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
gl_FragColor=result;}`;if(!e.ShadersStore[i])e.ShadersStore[i]=t;var a=[n,s,o];for(let r of a)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var u={name:i,shader:t};
export{u as Qk};

//# debugId=5B5BD166BBA9AAD364756E2164756E21
//# sourceMappingURL=site-71fk3wh7.js.map
