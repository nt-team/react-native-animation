import * as React from 'react'

let whiteList = [
    '[IndexPage]'
]

export default function immutableRenderDecorator(Target: React.ComponentClass<any>): any {
    class ImmutableRenderDecorator extends Target {
        shallowEqualImmutable(preObj: any, nxtObj: any) {
            if (preObj === nxtObj) {
                return true
            }

            // FIX: values may be null
            if (typeof preObj !== 'object' || preObj == void 0 ||
                typeof nxtObj !== 'object' || nxtObj == void 0) {
                return false
            }

            const preKey = Object.keys(preObj)
            const nxtKey = Object.keys(nxtObj)

            if (preKey.length !== nxtKey.length) {
                return false
            }

            for (let i = 0; i < nxtKey.length; i++) {
                if (nxtObj[nxtKey[i]] instanceof Function && preObj[nxtKey[i]] instanceof Function) {
                    continue
                }
                if (nxtObj[nxtKey[i]] !== preObj[nxtKey[i]]) {
                    return false
                }
            }
            return true
        }

        type() {
            return Target.toString().match(/\w+/g)[1]
        }

        compare(preObj: any, nxtObj: any, before: string) {
            if (nxtObj instanceof Object || nxtObj instanceof Array) {
                for (let key in nxtObj) {
                    if (nxtObj.hasOwnProperty(key)) {
                        let iseq = !!preObj && !!nxtObj && preObj[key] === nxtObj[key]
                        if (preObj[key] instanceof Function && nxtObj[key] instanceof Function) {
                            iseq = undefined
                        }
                        let str = before + '.' + key
                        if (iseq) {
                            console.log(str, iseq)
                        } else {
                            console.info(str, iseq)
                        }
                    }
                    if (preObj instanceof Object || preObj instanceof Array) {
                        this.compare(preObj[key], nxtObj[key], before + '.' + key)
                    }
                }
            }
        }

        shouldComponentUpdate(nextProps: any, nextState: any, context: any) {
            if (super.shouldComponentUpdate) {
                return super.shouldComponentUpdate(nextProps, nextState, context)
            }
            let update = !this.shallowEqualImmutable(this.props, nextProps) ||
                !this.shallowEqualImmutable(this.state, nextState)
            let type = this.type()
            if (whiteList.length > 0 && whiteList.indexOf(type) > -1) {
                console.log('immutableRenderDecorator', type, 'update?', update)
                console.log('equle?:',
                    'props:', nextProps === this.props,
                    'state:', nextState === this.state,
                    'shallowEqualImmutable?:',
                    'props:', this.shallowEqualImmutable(this.props, nextProps),
                    'state:', this.shallowEqualImmutable(this.state, nextState)
                )
                this.compare(this.props, nextProps, 'props')
            }
            return update
        }
    }
    return ImmutableRenderDecorator
}
