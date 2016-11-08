package com.baidu.wefan;

import android.support.annotation.Nullable;

/**
 * Created by zzy on 2016/6/30.
 */
public class AnimationModel {
    public enum AnimationType {
        Translate,
        Rotate,
        Scale,
        Alpha
    }

    public AnimationType type;
    public Float from;
    public Float to;
    public Float from2;
    public Float to2;
    public Float from3;
    public Float to3;
    public int duration;
    public int startOffset;
    public String interpolator; // 'Linear'
    public float interpolatorData;
    public int repeat;
}
