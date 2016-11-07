//
//  TBNAnimationView.m
//  TogetherHi
//
//  Created by zzy@baidu on 16/7/12.
//  Copyright © 2016年 Baidu. All rights reserved.
//

#import "RCTViewManager.h"
#import "TBNAnimationView.h"

@interface TBNAnimationView()

@property (nonatomic, copy) RCTDirectEventBlock onAnimationStart;
@property (nonatomic, copy) RCTDirectEventBlock onAnimationEnd;
@property (nonatomic, copy) RCTDirectEventBlock onAnimationCancel;
@property (nonatomic, copy) RCTDirectEventBlock onAnimationRepeat;

@end

@implementation TBNAnimationView

id _data;


- (UIView *)view
{
    return [[UIView alloc] init];
}

- (void)add:data
{
    _data = data;
}

-(void)setAniValue :key :(float)startOffset :(float)duration :(float)repeat :from :to
{
    //    NSLog(@"%@", str);
    CABasicAnimation *theAnimation;
    theAnimation = [CABasicAnimation animationWithKeyPath:key];
    theAnimation.fromValue = from;
    theAnimation.toValue = to;
    theAnimation.delegate = self;
    theAnimation.beginTime = startOffset;
    theAnimation.duration = duration;
    theAnimation.repeatCount = repeat;
    theAnimation.removedOnCompletion = FALSE;
    theAnimation.fillMode = kCAFillModeForwards;
    theAnimation.autoreverses = NO;
    theAnimation.cumulative = NO;
    theAnimation.timingFunction=[CAMediaTimingFunction functionWithName:kCAFilterLinear];
    [self.layer addAnimation:theAnimation forKey:nil];
}

- (void)start:data
{
    id aniData = data ? data : _data;
    for (NSDictionary* str in aniData) {
        NSTimeInterval duration = [str[@"duration"] doubleValue] / 1000;
        NSTimeInterval repeat = [str[@"repeat"] integerValue];
        NSTimeInterval startOffset = CACurrentMediaTime() + [str[@"startOffset"] doubleValue] / 1000;
        
        
        NSString *type = str[@"type"]; // 'translate' | 'Rotate' | 'Scale' | 'Alpha'
        
        if([type isEqual: @"Translate"]){
            [self setAniValue:@"transform.translation.x" :startOffset :duration :repeat :str[@"from"] :str[@"to"]];
            [self setAniValue:@"transform.translation.y" :startOffset :duration :repeat :str[@"from2"] :str[@"to2"]];
            [self setAniValue:@"transform.translation.z" :startOffset :duration :repeat :str[@"from3"] :str[@"to3"]];
        }
        
        if([type isEqual: @"Rotate"]){
            [self setAniValue:@"transform.rotation.x" :startOffset :duration :repeat :str[@"from"] :str[@"to"]];
            [self setAniValue:@"transform.rotation.y" :startOffset :duration :repeat :str[@"from2"] :str[@"to2"]];
            [self setAniValue:@"transform.rotation.z" :startOffset :duration :repeat :str[@"from3"] :str[@"to3"]];
        }
        
        if([type isEqual: @"Scale"]){
            [self setAniValue:@"transform.scale.x" :startOffset :duration :repeat :str[@"from"] :str[@"to"]];
            [self setAniValue:@"transform.scale.y" :startOffset :duration :repeat :str[@"from2"] :str[@"to2"]];
            [self setAniValue:@"transform.scale.z" :startOffset :duration :repeat :str[@"from3"] :str[@"to3"]];
        }
        
        if([type isEqual: @"Alpha"]){
            [self setAniValue:@"opacity" :startOffset :duration :repeat :str[@"from"] :str[@"to"]];
        }
    }
}

/* Called when the animation begins its active duration. */

- (void)animationDidStart:(CAAnimation *)anim
{
    if(_onAnimationStart){
        _onAnimationStart(nil);
    }
}

/* Called when the animation either completes its active duration or
 * is removed from the object it is attached to (i.e. the layer). 'flag'
 * is true if the animation reached the end of its active duration
 * without being removed. */

- (void)animationDidStop:(CAAnimation *)anim finished:(BOOL)flag
{
    if(flag){
        if(_onAnimationEnd){
            _onAnimationEnd(nil);
        }
    }else{
        if(_onAnimationCancel){
            _onAnimationCancel(nil);
        }
    }
}

- (void)clear
{
    [self.layer removeAllAnimations];
}

@end
