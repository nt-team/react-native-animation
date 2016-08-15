# react-native-animation
A native animation UI component for react-native.
(Recently, we will refactor and optimize this.)

## Install

```sh
npm i react-native-animation --save
```

### iOS
Podfile add
```
pod 'react-native-animation', :path => '../node_modules/react-native-animation'
```

### Android
Coming Soon

## Usage
A simple example:(fade in)
``` jsx
<Animation.AnimationView
    data={[{
        type: 'Alpha',
        from: 0,
        to: 1,
        duration: 500,
    }]} autoplay={true}>
        other views...
</Animation.AnimationView>
```

*Now support: 'Translate' | 'Rotate' | 'Scale' | 'Alpha'

## Props
``` typescript
export interface PropsDefine {
    data: AnimationModel[]
    style?: React.ViewStyle
    autoplay?: boolean
    autoclear?: boolean
    onStart?: (view: AnimationView) => void
    onEnd?: (view: AnimationView) => void
}
```

## methods
```
start()
clear()
```

## AnimationModel
``` typescript
export interface AnimationModel {
    name?: string
    type: 'Translate' | 'Rotate' | 'Scale' | 'Alpha'
    from?: number
    to?: number
    from2?: number
    to2?: number
    duration: number
    startOffset?: number
    interpolator?: 'Linear'
    interpolatorData?: number
    repeat?: number
}
```