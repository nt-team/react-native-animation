//
//  TBNAnimationView.m
//  TogetherHi
//
//  Created by zzy@baidu on 16/7/12.
//  Copyright © 2016年 Baidu. All rights reserved.
//

#import "RCTViewManager.h"
#import "TBNAnimationView.h"

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
        }
        
        if([type isEqual: @"Rotate"]){
            [self setAniValue:@"transform.rotation.x" :startOffset :duration :repeat :str[@"from"] :str[@"to"]];
            [self setAniValue:@"transform.rotation.y" :startOffset :duration :repeat :str[@"from2"] :str[@"to2"]];
        }
        
        if([type isEqual: @"Scale"]){
            [self setAniValue:@"transform.scale.x" :startOffset :duration :repeat :str[@"from"] :str[@"to"]];
            [self setAniValue:@"transform.scale.y" :startOffset :duration :repeat :str[@"from2"] :str[@"to2"]];
        }
        
        if([type isEqual: @"Alpha"]){
            [self setAniValue:@"opacity" :startOffset :duration :repeat :str[@"from"] :str[@"to"]];
        }
    }
}

- (void)finishAnimation
{
    NSLog(@"finishAnimation");
}

- (void)clear
{
    [self.layer removeAllAnimations];
}

@end