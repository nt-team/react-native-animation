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
import { Dimensions, findNodeHandle, UIManager, requireNativeComponent, Platform, View } from 'react-native';
import immutableRenderDecorator from './immutableRenderDecorator';
const TBNAnimationView = requireNativeComponent('TBNAnimationView', AnimationView, {
    nativeOnly: {}
});
export let AnimationView = class AnimationView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._screen_scale = Dimensions.get('window').scale;
        this.isUnmount = false;
        this._assignRoot = this._assignRoot.bind(this);
        this.isStart = false;
    }
    start() {
        if (Platform.OS === 'android') {
            return;
        }
        if (this.isUnmount) {
            return false;
        }
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.TBNAnimationView.Commands.start, [this.data]);
        this.isStart = true;
        // TODO 临时实现，待改成原生传回
        this.props.onStart && this.props.onStart(this);
        if (this.props.onEnd) {
            let maxTime = 0;
            for (let i = 0; i < this.data.length; i++) {
                const time = this.data[i].duration + this.data[i].startOffset;
                maxTime = maxTime > time ? maxTime : time;
            }
            setTimeout(function () {
                !this.isUnmount && this.props.onEnd && this.props.onEnd(this);
            }.bind(this), maxTime);
        }
    }
    clear() {
        if (Platform.OS === 'android') {
            return;
        }
        try {
            UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.TBNAnimationView.Commands.clear, []);
        }
        catch (error) {
        }
        this.isStart = false;
    }
    add(data) {
        if (Platform.OS === 'android') {
            return;
        }
        if (data) {
            this.data = data;
        }
        if (!this.data) {
            this.processData(this.props);
        }
        // UIManager.dispatchViewManagerCommand(
        //     findNodeHandle(this),
        //     UIManager.TBNAnimationView.Commands.add,
        //     [data || this.data]
        //     // [JSON.stringify(data || this.data)]
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
            this.processData(nextProps);
            this.add();
            if (this.props.autoplay) {
                setTimeout(() => {
                    this.start();
                }, 0);
            }
        }
    }
    render() {
        if (Platform.OS === 'android') {
            return (<View style={this.props.style}>
                    {this.props.children}
                </View>);
        }
        return (<TBNAnimationView ref={this._assignRoot} style={this.props.style}>
                {this.props.children}
            </TBNAnimationView>);
    }
    _assignRoot(component) {
        this._root = component;
    }
    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    }
    processData(props) {
        this.data = (props.data || []).slice();
        for (let i = 0; i < this.data.length; i++) {
            let data = this.data[i];
            if (data.type != 'Translate') {
                continue;
            }
        }
    }
};
AnimationView = __decorate([
    immutableRenderDecorator
], AnimationView);
//# sourceMappingURL=animation-view.jsx.map