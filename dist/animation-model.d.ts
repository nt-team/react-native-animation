export interface AnimationModel {
    /** 名称 */
    name?: string;
    /** 动画类型 */
    type: 'Translate' | 'Rotate' | 'Scale' | 'Alpha';
    /** 起始值 */
    from?: number;
    /** 目标值 */
    to?: number;
    from2?: number;
    to2?: number;
    /** 动画时间 */
    duration: number;
    /** 延迟 */
    startOffset?: number;
    /** 值函数 */
    interpolator?: 'Linear';
    interpolatorData?: number;
    /** 重复次数 */
    repeat?: number;
}
export interface AnimationGroup {
    name: string;
    data: AnimationModel[];
    repeat: number;
}
