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

    constructor(props: PropsDefine, context: any) {
        super(props, context)

        this._assignRoot = this._assignRoot.bind(this)
        this.isStart = false
        this.data = this.processData(props.data)
    }

    public start() {
        if (this.isUnmount) {
            return false
        }
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this),
            UIManager.TBNAnimationView.Commands.start,
            [Platform.OS === 'android' ? JSON.stringify(this.data || []) : this.data]
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

    public clear() {
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

    public add(data?: AnimationModel[]) {
        if (data) {
            this.data = this.processData(data)
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

            this.data = this.processData(nextProps.data)
            this.add()
            if (this.props.autoplay) {
                setTimeout(() => {
                    this.start()
                }, 0)
            }
        }
    }

    render() {
        return (
            <TBNAnimationView
                ref={this._assignRoot}
                style={[this.props.style, {
                    opacity: this.props.style.opacity || 1
                } as React.ViewStyle]}>
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

    private processData(oriData: AnimationModel[]): AnimationModel[] {
        let data = (oriData || []).slice()
        data.forEach((ani) => {
            if (ani.duration) {
                ani.duration = parseInt(ani.duration.toFixed(0))
            }
            if (ani.startOffset) {
                ani.startOffset = parseInt(ani.startOffset.toFixed(0))
            }
            if (ani.type == 'Translate' && Platform.OS === 'android') {
                if (ani.from) {
                    ani.from *= this._screen_scale
                } else {
                    ani.from = 0
                }
                if (ani.from2) {
                    ani.from2 *= this._screen_scale
                } else {
                    ani.from2 = 0
                }
                if (ani.to) {
                    ani.to *= this._screen_scale
                } else {
                    ani.to = 0
                }
                if (ani.to2) {
                    ani.to2 *= this._screen_scale
                } else {
                    ani.to2 = 0
                }
            }
        })
        return data
    }
}
