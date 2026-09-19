import{RC as e}from"./site-eq33q5cn.js";var r="decalFragment",o=`#ifdef DECAL
#ifdef GAMMADECAL
decalColor.rgb=toLinearSpace(decalColor.rgb);
#endif
#ifdef DECAL_SMOOTHALPHA
decalColor.a*=decalColor.a;
#endif
surfaceAlbedo.rgb=mix(surfaceAlbedo.rgb,decalColor.rgb,decalColor.a);
#endif
`;if(!e.IncludesShadersStore[r])e.IncludesShadersStore[r]=o;var d={name:r,shader:o};
export{d as Yy};

//# debugId=BFD7B4794B66602364756E2164756E21
//# sourceMappingURL=site-vq5qqqfj.js.map
