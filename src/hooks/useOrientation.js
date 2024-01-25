import React, {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';

// check screen is portrait or landscape
const isPortrait = () => {
  const dimen = Dimensions.get('screen');
  return dimen.height >= dimen.width;
};

const useOrientation = () => {
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'));

  const onChange = result => {
    setScreenInfo(result.screen);
  };

  useEffect(() => {
    Dimensions?.addEventListener('change', onChange);

    return () => Dimensions.addEventListener('change', onChange);
  }, []);

  return {
    ...screenInfo,
    isPortrait: isPortrait(),
  };
};

export default useOrientation;
