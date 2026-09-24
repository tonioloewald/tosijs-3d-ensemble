import{qz as n}from"./site-rbww4kp1.js";import{rz as o}from"./site-3f0c1s8h.js";import{Dz as s}from"./site-231618cv.js";import{TC as e}from"./site-qntg4d3x.js";var i="imageProcessingPixelShader",t=`varying vec2 vUV;uniform sampler2D textureSampler;
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
export{u as Sk};

//# debugId=89615BF45700EDB064756E2164756E21
//# sourceMappingURL=site-y0tfehy6.js.map
