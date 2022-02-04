import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, useWindowDimensions, Image} from 'react-native';
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
import Like from '../../../assets/images/LIKE.png'
import Nope from '../../../assets/images/nope.png'

const AnimatedStack = props => {
  const { data, renderItem, onSwipeLeft, onSwipeRight, setCurrentMovie, resetFlag } = props;
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(currentIndex + 1)
  const nextProfile = data[nextIndex]
  const currentProfile = data[currentIndex]
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

  const likeStyle = useAnimatedStyle(()=> ({
    opacity: interpolate(translateX.value,[0,hiddenTranslateX / 10], [0,1])
  }));
  const nopeStyle = useAnimatedStyle(()=> ({
    opacity: interpolate(translateX.value,[0,-hiddenTranslateX / 10 ], [0,1])
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

      const onSwipe = event.velocityX > 0 ? onSwipeRight : onSwipeLeft
      onSwipe && runOnJS(onSwipe)(currentProfile)

  }})
  
  useEffect(() => {
    translateX.value = 0
    setNextIndex(currentIndex + 1);
    if (nextProfile == null && props.resetFlag == true) {
      setCurrentIndex(0)
    }
  },[currentIndex, translateX])

  useEffect(() => {
    setCurrentMovie(currentProfile)
  },[currentIndex])



  return (

      <View style={styles.root}>
            {nextProfile &&
        <View style={styles.nextCardContainer}>
          <Animated.View style={[styles.animatedCard, nextCardStyle]}>
          {renderItem({item: nextProfile})}
          </Animated.View>

        </View>
    }
      {currentProfile &&
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
          <Animated.Image source ={Like} style={[styles.like, likeStyle]} resizeMode='contain'></Animated.Image>
          <Animated.Image source ={Nope} style={[styles.nope, nopeStyle]} resizeMode='contain'></Animated.Image> 
          {renderItem({item: currentProfile})}

          </Animated.View>
        </PanGestureHandler>
}
      </View>
      
    
  );
};

const styles = StyleSheet.create({
  root: {
      width: '100%',
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
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  like: {
    height: 150,
    width: 150,
    position: 'absolute',
    top: 10,
    zIndex: 1,
    right: 10
    
  },
  nope: {
    height: 150,
    width: 150,
    position: 'absolute',
    top: 10,
    zIndex: 1,
    left: 10 
  }

});

export default AnimatedStack;
