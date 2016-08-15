//
//  TBNAnimationView.h
//  TogetherHi
//
//  Created by zzy@baidu on 16/7/12.
//  Copyright © 2016年 Baidu. All rights reserved.
//
#import <UIKit/UIKit.h>
#import "RCTView.h"
#import "RCTEventDispatcher.h"

@interface TBNAnimationView : RCTView

- (void)add:data;
- (void)start:data;
- (void)clear;

@end