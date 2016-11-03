package com.baidu.wefan;

import android.support.annotation.IntDef;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * Created by zzy on 2016/11/3.
 */

public class AnimationEvent extends Event<AnimationEvent> {
    @IntDef({
            ON_ANIMATION_START, ON_ANIMATION_END, ON_ANIMATION_CANCEL, ON_ANIMATION_REPEAT
    })
    @Retention(RetentionPolicy.SOURCE)
    @interface AnimationEventType {
    }

    public static final int ON_ANIMATION_START = 1;
    public static final int ON_ANIMATION_END = 2;
    public static final int ON_ANIMATION_CANCEL = 3;
    public static final int ON_ANIMATION_REPEAT = 4;

    private final int mEventType;

    public AnimationEvent(int viewTag, int eventType) {
        super(viewTag);
        this.mEventType = eventType;
    }

    public static String eventNameForType(@AnimationEventType int eventType) {
        switch (eventType) {
            case ON_ANIMATION_START:
                return "topAnimationStart";
            case ON_ANIMATION_END:
                return "topAnimationEnd";
            case ON_ANIMATION_CANCEL:
                return "topAnimationCancel";
            case ON_ANIMATION_REPEAT:
                return "topAnimationRepeat";
            default:
                throw new IllegalStateException("Invalid animation event:" + Integer.toString(eventType));
        }
    }

    @Override
    public String getEventName() {
        return AnimationEvent.eventNameForType(mEventType);
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap eventData = null;
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
    }
}
