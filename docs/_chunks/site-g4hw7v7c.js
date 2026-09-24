import{TC as e}from"./site-qntg4d3x.js";var r="decalFragment",o=`#ifdef DECAL
#ifdef GAMMADECAL
decalColor.rgb=toLinearSpace(decalColor.rgb);
#endif
#ifdef DECAL_SMOOTHALPHA
decalColor.a*=decalColor.a;
#endif
surfaceAlbedo.rgb=mix(surfaceAlbedo.rgb,decalColor.rgb,decalColor.a);
#endif
`;if(!e.IncludesShadersStore[r])e.IncludesShadersStore[r]=o;var d={name:r,shader:o};
export{d as _y};

//# debugId=D0F1F04C00B915A764756E2164756E21
//# sourceMappingURL=site-g4hw7v7c.js.map
