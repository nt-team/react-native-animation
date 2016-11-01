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
                    if (m.from != null && m.to != null && m.from2 != null && m.to2 != null) {
                        PropertyValuesHolder tranX = PropertyValuesHolder.ofFloat("translationX", m.from, m.to);
                        PropertyValuesHolder tranY = PropertyValuesHolder.ofFloat("translationY", m.from2, m.to2);
                        animator = ObjectAnimator.ofPropertyValuesHolder(this, tranX, tranY);
                    } else if (m.from != null && m.to != null) {
                        PropertyValuesHolder tranX = PropertyValuesHolder.ofFloat("translationX", m.from, m.to);
                        animator = ObjectAnimator.ofPropertyValuesHolder(this, tranX);
                    } else if (m.from2 != null && m.to2 != null) {
                        PropertyValuesHolder tranY = PropertyValuesHolder.ofFloat("translationY", m.from2, m.to2);
                        animator = ObjectAnimator.ofPropertyValuesHolder(this, tranY);
                    }
                    break;
                case Rotate:
                    animator = ObjectAnimator.ofFloat(this, "rotation", m.from, m.to);
                    break;
                case Scale:
                    PropertyValuesHolder scaleX = PropertyValuesHolder.ofFloat("scaleX", m.from, m.to);
                    PropertyValuesHolder scaleY = PropertyValuesHolder.ofFloat("scaleY", m.from2, m.to2);
                    animator = ObjectAnimator.ofPropertyValuesHolder(this, scaleX, scaleY);
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
        animatorSet.playTogether(animators);
        animatorSet.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animation) {
                onReceiveNativeEvent("onAnimationStart");
            }

            @Override
            public void onAnimationEnd(Animator animation) {
                onReceiveNativeEvent("onAnimationEnd");
            }

            @Override
            public void onAnimationCancel(Animator animation) {
                onReceiveNativeEvent("onAnimationCancel");
            }

            @Override
            public void onAnimationRepeat(Animator animation) {
                onReceiveNativeEvent("onAnimationRepeat");
            }
        });
    }

    public void onReceiveNativeEvent(String animState) {
        WritableMap event = Arguments.createMap();
        event.putString("animatorState", animState);
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "topChange",
                event);
    }

    public void addAnimations(AnimationModel[] data) {
        animationSet = new AnimationSet(false);
        animationSet.setFillEnabled(true);
        animationSet.setFillAfter(true);
        animationSet.setFillBefore(false);
        for (AnimationModel m : data) {
            Animation animation = null;
            switch (m.type) {
                case Translate:
                    if (m.from != null && m.to != null && m.from2 != null && m.to2 != null) {
                        animation = new TranslateAnimation(m.from, m.to, m.from2, m.to2);
                    } else if (m.from != null && m.to != null) {
                        animation = new TranslateAnimation(m.from, m.to, 0, 0);
                    } else if (m.from2 != null && m.to2 != null) {
                        animation = new TranslateAnimation(0, 0, m.from2, m.to2);
                    }
                    break;
                case Rotate:
                    animation = new RotateAnimation(m.from, m.to);
                    break;
                case Scale:
                    animation = new ScaleAnimation(m.from, m.to, m.from2, m.to2);
                    break;
                case Alpha:
                    System.out.println("Animation:Alpha " + m.from + " " + m.to);
                    animation = new AlphaAnimation(m.from, m.to);
                    break;
            }
            if (animation == null) {
                continue;
            }
            animation.setDuration(m.duration);
            animation.setInterpolator(new LinearInterpolator());//TODO
            animation.setRepeatCount(m.repeat);
            animation.setStartOffset(m.startOffset);
            animationSet.addAnimation(animation);
        }
        animationSet.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {

            }

            @Override
            public void onAnimationEnd(Animation animation) {

            }

            @Override
            public void onAnimationRepeat(Animation animation) {

            }
        });
    }
}
