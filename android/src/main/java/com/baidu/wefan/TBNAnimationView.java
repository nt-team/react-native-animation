package com.baidu.wefan;

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

/**
 * Created by zzy on 2016/6/28.
 */
public class TBNAnimationView extends ViewGroup {
    AnimationSet animationSet;

    public TBNAnimationView(Context context) {
        super(context);
    }

    public void clear() {
        this.clearAnimation();
    }

    public void start() {
        if (animationSet != null) {
            this.startAnimation(animationSet);
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
