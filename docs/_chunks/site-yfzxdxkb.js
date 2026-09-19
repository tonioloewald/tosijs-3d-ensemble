import{RC as e}from"./site-eq33q5cn.js";var a="areaLightTextureProcessingPixelShader",r=`uniform sampler2D textureSampler;uniform vec2 scalingRange;varying vec2 vUV;void main(void)
{float x=(vUV.x-scalingRange.x)/(scalingRange.y-scalingRange.x);float y=(vUV.y-scalingRange.x)/(scalingRange.y-scalingRange.x);vec2 scaledUV=vec2(x,y);gl_FragColor=texture2D(textureSampler,scaledUV);}
`;if(!e.ShadersStore[a])e.ShadersStore[a]=r;var g={name:a,shader:r};
export{g as qh};

//# debugId=8D2FE49B4B63399E64756E2164756E21
//# sourceMappingURL=site-yfzxdxkb.js.map
