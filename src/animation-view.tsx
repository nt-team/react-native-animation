/**
 * @author      : zhangzhenyang
 * @description : 动画基础组件
 * @update      : 2016-07-24 17:35:49
 */

import * as React from 'react'
import {
    DeviceEventEmitter,
    Dimensions,
    findNodeHandle,
    UIManager,
    requireNativeComponent,
    Platform,
    View,
} from 'react-native'
import immutableRenderDecorator from './immutableRenderDecorator'
import { AnimationModel, AnimationGroup } from './animation-model'

const TBNAnimationView = requireNativeComponent('TBNAnimationView', AnimationView, {
    nativeOnly: {
    }
})

export interface PropsDefine {
    /** 动画数据 */
    data: AnimationModel[]
    style?: React.ViewStyle
    /** 是否自动播放 */
    autoplay?: boolean
    /** 是否数据变更时自动清除动画 */
    autoclear?: boolean
    /** 开始播放动画回调 */
    onStart?: (view: AnimationView) => void
    /** 结束播放动画回调 */
    onEnd?: (view: AnimationView) => void
    /** 动画循环结束回调(暂未实现) */
    onRepeatEnd?: (view: AnimationView) => void
}
@immutableRenderDecorator
export class AnimationView extends React.Component<PropsDefine, {}> {
    private _root: AnimationView
    private _screen_scale = Dimensions.get('window').scale
    private isStart: boolean
    private data: AnimationModel[]
    private isUnmount = false

    constructor(props: any, context: any) {
        super(props, context)

        this._assignRoot = this._assignRoot.bind(this)
        this.isStart = false
    }

    start() {
        if (Platform.OS === 'android') {
            return
        }
        if (this.isUnmount) {
            return false
        }
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this),
            UIManager.TBNAnimationView.Commands.start,
            [this.data]
        )
        this.isStart = true

        // TODO 临时实现，待改成原生传回
        this.props.onStart && this.props.onStart(this)
        if (this.props.onEnd) {
            let maxTime = 0
            for (let i = 0; i < this.data.length; i++) {
                const time = this.data[i].duration + this.data[i].startOffset
                maxTime = maxTime > time ? maxTime : time
            }
            setTimeout(function () {
                !this.isUnmount && this.props.onEnd && this.props.onEnd(this)
            }.bind(this), maxTime)
        }
    }

    clear() {
        if (Platform.OS === 'android') {
            return
        }
        try {
            UIManager.dispatchViewManagerCommand(
                findNodeHandle(this),
                UIManager.TBNAnimationView.Commands.clear,
                []
            )
        } catch (error) {
        }
        this.isStart = false
    }

    add(data?: AnimationModel[]) {
        if (Platform.OS === 'android') {
            return
        }
        if (data) {
            this.data = data
        }
        if (!this.data) {
            this.processData(this.props)
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
        this.add()
        if (this.props.autoplay) {
            this.start()
        }
    }

    componentWillUnmount() {
        this.isUnmount = true
        this.clear()
    }

    componentWillReceiveProps(nextProps: PropsDefine) {
        if (nextProps !== this.props
            && nextProps.data !== this.props.data) {
            if (nextProps.autoclear) {
                this.clear()
            }

            this.processData(nextProps)
            this.add()
            if (this.props.autoplay) {
                setTimeout(() => {
                    this.start()
                }, 0)
            }
        }
    }

    render() {
        if (Platform.OS === 'android') {
            return (
                <View
                    style={this.props.style}>
                    {this.props.children}
                </View>
            )
        }

        return (
            <TBNAnimationView
                ref={this._assignRoot}
                style={this.props.style}>
                {this.props.children}
            </TBNAnimationView>
        )
    }

    private _assignRoot(component: AnimationView) {
        this._root = component
    }

    private setNativeProps(nativeProps: PropsDefine) {
        this._root.setNativeProps(nativeProps)
    }

    private processData(props: PropsDefine) {
        this.data = (props.data || []).slice()
        for (let i = 0; i < this.data.length; i++) {
            let data = this.data[i]
            if (data.type != 'Translate') {
                continue
            }
            // FIXME Android 需要
            // if (data.from) {
            //     data.from *= this._screen_scale
            // }
            // if (data.from2) {
            //     data.from2 *= this._screen_scale
            // }
            // if (data.to) {
            //     data.to *= this._screen_scale
            // }
            // if (data.to2) {
            //     data.to2 *= this._screen_scale
            // }
        }
    }
}
