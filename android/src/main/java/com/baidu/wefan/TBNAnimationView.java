package com.baidu.wefan;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import android.content.Context;
import android.view.MotionEvent;
import android.view.ViewGroup;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.view.animation.ScaleAnimation;
import android.view.animation.TranslateAnimation;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zzy on 2016/6/28.
 */
public class TBNAnimationView extends ViewGroup {
    AnimationSet animationSet;
    AnimatorSet animatorSet;

    public TBNAnimationView(Context context) {
        super(context);
    }

    public void clear() {
//        this.clearAnimation();
        if (animatorSet != null) {
            animatorSet.cancel();
        }
    }

    public void start() {
        if (animatorSet != null) {
//            this.startAnimation(animationSet);
            animatorSet.start();
        }
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        return super.onTouchEvent(ev);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        // No-op since UIManagerModule handles actually laying out children.
    }

    public void addAnimators(AnimationModel[] data) {
        animatorSet = new AnimatorSet();
        List<Animator> animators = new ArrayList<>();
        for (AnimationModel m : data) {
            ObjectAnimator animator = null;
            switch (m.type) {
                case Translate:
                    PropertyValuesHolder tranX = PropertyValuesHolder.ofFloat("translationX", m.from, m.to);
                    PropertyValuesHolder tranY = PropertyValuesHolder.ofFloat("translationY", m.from2, m.to2);
                    PropertyValuesHolder tranZ = PropertyValuesHolder.ofFloat("translationZ", m.from3, m.to3);
                    animator = ObjectAnimator.ofPropertyValuesHolder(this, tranX, tranY, tranZ);
                    break;
                case Rotate:
                    PropertyValuesHolder rotaX = PropertyValuesHolder.ofFloat("translationX", m.from, m.to);
                    PropertyValuesHolder rotaY = PropertyValuesHolder.ofFloat("translationY", m.from2, m.to2);
                    PropertyValuesHolder rotaZ = PropertyValuesHolder.ofFloat("translationZ", m.from3, m.to3);
                    animator = ObjectAnimator.ofPropertyValuesHolder(this, rotaX, rotaY, rotaZ);
                    break;
                case Scale:
                    PropertyValuesHolder scaleX = PropertyValuesHolder.ofFloat("scaleX", m.from, m.to);
                    PropertyValuesHolder scaleY = PropertyValuesHolder.ofFloat("scaleY", m.from2, m.to2);
                    PropertyValuesHolder scaleZ = PropertyValuesHolder.ofFloat("scaleZ", m.from3, m.to3);
                    animator = ObjectAnimator.ofPropertyValuesHolder(this, scaleX, scaleY, scaleZ);
                    break;
                case Alpha:
                    animator = ObjectAnimator.ofFloat(this, "alpha", m.from, m.to);
                    break;
                default:
                    break;
            }

            if (animator == null) {
                continue;
            }
            animator.setDuration(m.duration);
            animator.setInterpolator(new LinearInterpolator());
            animator.setRepeatCount(m.repeat);
            animator.setStartDelay(m.startOffset);
            animators.add(animator);
        }
        animatorSet.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animation) {
//                onReceiveNativeEvent("onAnimationStart");
                onReceiveNativeEvent(new AnimationEvent(
                        getId(),
                        AnimationEvent.ON_ANIMATION_START
                ));
            }

            @Override
            public void onAnimationEnd(Animator animation) {
//                onReceiveNativeEvent("onAnimationEnd");
                onReceiveNativeEvent(new AnimationEvent(
                        getId(),
                        AnimationEvent.ON_ANIMATION_END
                ));
            }

            @Override
            public void onAnimationCancel(Animator animation) {
//                onReceiveNativeEvent("onAnimationCancel");
                onReceiveNativeEvent(new AnimationEvent(
                        getId(),
                        AnimationEvent.ON_ANIMATION_CANCEL
                ));
            }

            @Override
            public void onAnimationRepeat(Animator animation) {
//                onReceiveNativeEvent("onAnimationRepeat");
                onReceiveNativeEvent(new AnimationEvent(
                        getId(),
                        AnimationEvent.ON_ANIMATION_REPEAT
                ));
            }
        });

        animatorSet.playTogether(animators);
    }

    public void onReceiveNativeEvent(AnimationEvent event) {
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getNativeModule(UIManagerModule.class)
                .getEventDispatcher()
                .dispatchEvent(event);
    }

}
