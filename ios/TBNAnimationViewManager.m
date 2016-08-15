//
//  TBNAnimationView.m
//  TogetherHi
//
//  Created by zzy@baidu on 16/7/12.
//  Copyright © 2016年 Baidu. All rights reserved.
//

#import "TBNAnimationViewManager.h"
#import "RCTBridge.h"
#import <AVFoundation/AVFoundation.h>
#import "TBNAnimationView.h"
#import "RCTUIManager.h"

@implementation TBNAnimationViewManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view
{
    return [[TBNAnimationView alloc] init];
}

- (NSArray *)customDirectEventTypes
{
    return @[
             @"onAnimationStart",
             @"onAnimationEnd",
             @"onAnimationRepeat",
             ];
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}


RCT_EXPORT_METHOD(add:(nonnull NSNumber *)reactTag
                  data:data)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, TBNAnimationView *> *viewRegistry) {
        TBNAnimationView *view = viewRegistry[reactTag];
        if (![view isKindOfClass:[TBNAnimationView class]]) {
//            RCTLogError(@"Invalid view returned from registry, expecting TBNAnimationView, got: %@", view);
        } else {
            [view add:data];
        }
    }];
}

RCT_EXPORT_METHOD(clear:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, TBNAnimationView *> *viewRegistry) {
        TBNAnimationView *view = viewRegistry[reactTag];
        if (![view isKindOfClass:[TBNAnimationView class]]) {
//            RCTLogError(@"Invalid view returned from registry, expecting TBNAnimationView, got: %@", view);
        } else {
            [view clear];
        }
    }];
}

RCT_EXPORT_METHOD(start:(nonnull NSNumber *)reactTag
                  data:data)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, TBNAnimationView *> *viewRegistry) {
        TBNAnimationView *view = viewRegistry[reactTag];
        if (![view isKindOfClass:[TBNAnimationView class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting TBNAnimationView, got: %@", view);
        } else {
            [view start:data];
        }
    }];
}

@end
