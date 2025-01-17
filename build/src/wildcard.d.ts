import { Axis } from 'vega-lite/build/src/axis';
import { BinParams } from 'vega-lite/build/src/bin';
import { ExtendedChannel } from 'vega-lite/build/src/channel';
import { TypedFieldDef } from 'vega-lite/build/src/channeldef';
import { Legend } from 'vega-lite/build/src/legend';
import { Mark } from 'vega-lite/build/src/mark';
import { Scale } from 'vega-lite/build/src/scale';
import { EncodingSortField, SortOrder } from 'vega-lite/build/src/sort';
import { StackOffset } from 'vega-lite/build/src/stack';
import { QueryConfig } from './config';
import { Property } from './property';
import { Schema } from './schema';
export declare const SHORT_WILDCARD: SHORT_WILDCARD;
export declare type SHORT_WILDCARD = '?';
export interface Wildcard<T> {
    name?: string;
    /**
     * List of values to enumerate
     */
    enum?: T[];
}
export declare type WildcardProperty<T> = T | Wildcard<T> | SHORT_WILDCARD;
export interface ExtendedWildcard<T> extends Wildcard<T> {
    [prop: string]: any;
}
export declare function isWildcard(prop: any): prop is Wildcard<any> | SHORT_WILDCARD;
export declare function isShortWildcard(prop: any): prop is SHORT_WILDCARD;
export declare function isWildcardDef(prop: any): prop is Wildcard<any>;
export declare function initWildcard(prop: SHORT_WILDCARD | ExtendedWildcard<any>, defaultName: string, defaultEnumValues: any[]): ExtendedWildcard<any>;
export declare const DEFAULT_NAME: {
    mark: string;
    channel: string;
    aggregate: string;
    autoCount: string;
    hasFn: string;
    bin: string;
    sort: string;
    stack: string;
    scale: string;
    format: string;
    axis: string;
    legend: string;
    value: string;
    timeUnit: string;
    field: string;
    type: string;
    binProps: {
        maxbins: string;
        min: string;
        max: string;
        base: string;
        step: string;
        steps: string;
        minstep: string;
        divide: string;
    };
    sortProps: {
        field: string;
        op: string;
        order: string;
    };
    scaleProps: {};
    axisProps: {};
    legendProps: {};
};
export declare function getDefaultName(prop: Property): any;
/**
 * Generic index for default enum (values to enumerate) of a particular definition type.
 */
export declare type DefEnumIndex<T> = {
    [P in keyof T]-?: T[P][];
};
export declare type EnumIndex = {
    mark: Mark[];
    channel: ExtendedChannel[];
    autoCount: boolean[];
    hasFn: boolean[];
} & DefEnumIndex<TypedFieldDef<string>> & {
    sort: (EncodingSortField<string> | SortOrder)[];
    stack: StackOffset[];
    format: string[];
    scale: boolean[];
    axis: boolean[];
    legend: boolean[];
    value: any[];
    binProps: Partial<DefEnumIndex<BinParams>>;
    sortProps: Partial<DefEnumIndex<EncodingSortField<string>>>;
    scaleProps: Partial<DefEnumIndex<Scale>>;
    axisProps: Partial<DefEnumIndex<Axis>>;
    legendProps: Partial<DefEnumIndex<Legend<any>>>;
};
export declare const DEFAULT_ENUM_INDEX: EnumIndex;
export declare function getDefaultEnumValues(prop: Property, schema: Schema, opt: QueryConfig): any[];
