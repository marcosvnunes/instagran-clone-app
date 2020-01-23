import React, { useState, useEffect } from 'react';

import { Small , Original} from './styles';
import { Animated } from 'react-native';

export default function LazyImage({
    smallSource,
    source,
    aspectRatio,
    shouldLoad,
}) {

    const opacity = new Animated.Value(0)
    const [loaded , setLoaded] = useState(false)

    useEffect(()=>{
        if(shouldLoad){
            setTimeout(()=>{
            setLoaded(true)
            },1000)
        }
    },[shouldLoad])

    function handleAnimate(){
        Animated.timing(opacity,{
            toValue:1,
            duration:500,
            useNativeDriver:true,
        }).start();
    }

  return (
    <Small 
        source={smallSource} 
        ratio={parseFloat(aspectRatio)} 
        resizeMode="contain" 
        blurRadius={2}
    >
        {
         loaded && 
            <Original
                style={{opacity}}
                source={source} 
                ratio={parseFloat(aspectRatio)} 
                resizeMode="contain"
                onLoadEnd={handleAnimate}
            />
        }
        

    </Small>
  );
}
