package com.baidu.wefan;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.google.gson.Gson;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by zzy on 2016/6/28.
 */
public class AnimationViewManager extends ViewGroupManager<TBNAnimationView> {
    public static final int COMMAND_START = 1;
    public static final int COMMAND_CLEAR = 2;
    public static final int COMMAND_ADD = 3;
    public static final int ON_START = 4;
    public static final int ON_END = 5;
    public static final int ON_REPEAT = 6;

    public static final String REACT_CLASS = "TBNAnimationView";

    public static final Gson GSON = new Gson();

    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "start",
                COMMAND_START,
                "clear",
                COMMAND_CLEAR,
                "add",
                COMMAND_ADD,
                "onAnimationStart",
                ON_START,
                "onAnimationEnd",
                ON_END,
                "onAnimationRepeat",
                ON_REPEAT
        );
    }

    @Override
    public void receiveCommand(TBNAnimationView root, int commandId, @Nullable ReadableArray args) {
        System.out.println("~~~~~~~~~TBNAnimationView~~~receiveCommand~~~~~~~~~~~~~");
        switch (commandId) {
            case COMMAND_START: {
                if (args == null || args.size() != 1) {
                    throw new JSApplicationIllegalArgumentException(
                            "Illegal number of arguments for 'COMMAND_START' command");
                }
                String data = args.getString(0);
                System.out.println("START:" + data);
                root.addAnimations(GSON.fromJson(data, AnimationModel[].class));
                root.start();
                break;
            }
            case COMMAND_CLEAR: {
                if (args == null || args.size() != 0) {
                    throw new JSApplicationIllegalArgumentException(
                            "Illegal number of arguments for 'COMMAND_CLEAR' command");
                }
                root.clear();
                break;
            }
            case COMMAND_ADD: {
                if (args == null || args.size() != 1) {
                    throw new JSApplicationIllegalArgumentException(
                            "Illegal number of arguments for 'COMMAND_ADD' command");
                }
                String data = args.getString(0);
                root.addAnimations(GSON.fromJson(data, AnimationModel[].class));
                break;
            }
        }
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected TBNAnimationView createViewInstance(ThemedReactContext context) {
        return new TBNAnimationView(context);
    }
}
