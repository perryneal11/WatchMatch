import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, useWindowDimensions, Image} from 'react-native';
import Card from './src/component/ShowCard/index.js';
import users from 'WatchMatch/assets/data/users.js';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedGestureHandler,
  useDerivedValue,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Like from './assets/images/LIKE.png'
import Nope from './assets/images/nope.png'

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(currentIndex + 1)
  const nextProfile = users[nextIndex]
  const currentProfile = users[currentIndex]
  const {width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const hiddenTranslateX = 2 * screenWidth
  const SWIPE_VELOCITY = 800
  const rotate = useDerivedValue(() => interpolate(translateX.value, [0, hiddenTranslateX], [0,60]) + 'deg')

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value,
      },
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
       scale: interpolate(translateX.value,[-hiddenTranslateX,0,hiddenTranslateX], [1,0.5,1 ]) 
      }

  
    ],
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value
      console.log('touch start');
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.velocityX) < SWIPE_VELOCITY){
        translateX.value = withSpring(0);
        return
      }
      translateX.value = withSpring(event.translationX > 0 ? hiddenTranslateX : -hiddenTranslateX,{},
      () => runOnJS(setCurrentIndex)(currentIndex + 1),
      );
  }})
  
  useEffect(() => {
    translateX.value = 0
    setNextIndex(currentIndex + 1);
  },[currentIndex, translateX])

  return (

      <View style={styles.pageContainer}>
            {nextProfile &&
        <View style={styles.nextCardContainer}>
          <Animated.View style={[styles.animatedCard, nextCardStyle]}>
          <Card show={nextProfile}/>
          </Animated.View>

        </View>
    }
      {currentProfile &&
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
            <Card show={currentProfile} />
            <Image source ={Like}></Image>
            <Image source ={Nope}></Image>
          </Animated.View>
        </PanGestureHandler>
}
      </View>
      
    
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  animatedCard: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  like: {
    height: 100,
    width: 100,
    position: 'absolute',
    top: 10
    
  },
  nope: {

  }

});

export default App;
