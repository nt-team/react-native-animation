/**
 * @author      : zhangzhenyang
 * @description : 动画基础组件
 * @update      : 2016-07-24 17:35:49
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { Dimensions, findNodeHandle, UIManager, requireNativeComponent, Platform, } from 'react-native';
import immutableRenderDecorator from './immutableRenderDecorator';
const TBNAnimationView = requireNativeComponent('TBNAnimationView', AnimationView, {
    nativeOnly: {
        onAnimationStart: true,
        onAnimationEnd: true,
        onAnimationCancel: true,
        onAnimationRepeat: true,
    }
});
let AnimationView = class AnimationView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._screen_scale = Dimensions.get('window').scale;
        this.isUnmount = false;
        this._assignRoot = this._assignRoot.bind(this);
        this.isStart = false;
        this.data = this.processData(props.data);
    }
    start() {
        if (this.isUnmount) {
            return false;
        }
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.TBNAnimationView.Commands.start, [Platform.OS === 'android' ? JSON.stringify(this.data || []) : this.data]);
        this.isStart = true;
    }
    clear() {
        try {
            UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.TBNAnimationView.Commands.clear, []);
        }
        catch (error) {
        }
        this.isStart = false;
    }
    add(data) {
        if (data) {
            this.data = this.processData(data);
        }
        // UIManager.dispatchViewManagerCommand(
        //     findNodeHandle(this),
        //     UIManager.TBNAnimationView.Commands.add,
        //     [data || this.data]
        //     // [JSON.stringify(this.data || data)]
        // )
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.add();
        if (this.props.autoplay) {
            this.start();
        }
    }
    componentWillUnmount() {
        this.isUnmount = true;
        this.clear();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props
            && nextProps.data !== this.props.data) {
            if (nextProps.autoclear) {
                this.clear();
            }
            this.data = this.processData(nextProps.data);
            this.add();
            if (this.props.autoplay) {
                setTimeout(() => {
                    this.start();
                }, 0);
            }
        }
    }
    onAnimationStart() {
        this.props.onStart && this.props.onStart(this);
    }
    onAnimationEnd() {
        this.props.onEnd && this.props.onEnd(this);
    }
    onAnimationCancel() {
        this.props.onCancel && this.props.onCancel(this);
    }
    onAnimationRepeat() {
        this.props.onRepeat && this.props.onRepeat(this);
    }
    render() {
        return (React.createElement(TBNAnimationView, { ref: this._assignRoot, style: this.props.style, onAnimationStart: this.onAnimationStart.bind(this), onAnimationEnd: this.onAnimationEnd.bind(this), onAnimationCancel: this.onAnimationCancel.bind(this), onAnimationRepeat: this.onAnimationRepeat.bind(this) }, this.props.children));
    }
    _assignRoot(component) {
        this._root = component;
    }
    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    }
    processData(oriData) {
        let data = (oriData || []).slice();
        data.forEach((ani) => {
            if (ani.duration) {
                ani.duration = parseInt(ani.duration.toFixed(0));
            }
            if (ani.startOffset) {
                ani.startOffset = parseInt(ani.startOffset.toFixed(0));
            }
            if (Platform.OS === 'android') {
                ani.from = ani.from || 0;
                ani.to = ani.to || 0;
                ani.from2 = ani.from2 || 0;
                ani.to2 = ani.to2 || 0;
                ani.from3 = ani.from3 || 0;
                ani.to3 = ani.to3 || 0;
                switch (ani.type) {
                    case 'Translate':
                        if (ani.from) {
                            ani.from *= this._screen_scale;
                        }
                        if (ani.to) {
                            ani.to *= this._screen_scale;
                        }
                        if (ani.from2) {
                            ani.from2 *= this._screen_scale;
                        }
                        if (ani.to2) {
                            ani.to2 *= this._screen_scale;
                        }
                        if (ani.from3) {
                            ani.from3 *= this._screen_scale;
                        }
                        if (ani.to3) {
                            ani.to3 *= this._screen_scale;
                        }
                        break;
                }
            }
            else if (Platform.OS === 'ios') {
                switch (ani.type) {
                    case 'Rotate':
                        if (ani.from) {
                            ani.from /= (180 / Math.PI);
                        }
                        if (ani.to) {
                            ani.to /= (180 / Math.PI);
                        }
                        if (ani.from2) {
                            ani.from2 /= (180 / Math.PI);
                        }
                        if (ani.to2) {
                            ani.to2 /= (180 / Math.PI);
                        }
                        if (ani.from3) {
                            ani.from3 /= (180 / Math.PI);
                        }
                        if (ani.to3) {
                            ani.to3 /= (180 / Math.PI);
                        }
                        break;
                }
            }
        });
        return data;
    }
};
AnimationView = __decorate([
    immutableRenderDecorator
], AnimationView);
export { AnimationView };
//# sourceMappingURL=animation-view.js.map