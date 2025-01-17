import { ExtendedChannel } from 'vega-lite/build/src/channel';
import { Config } from 'vega-lite/build/src/config';
import { Data } from 'vega-lite/build/src/data';
import { Mark } from 'vega-lite/build/src/mark';
import { FacetedUnitSpec, TopLevel } from 'vega-lite/build/src/spec';
import { Step } from 'vega-lite/build/src/spec/base';
import { StackOffset, StackProperties } from 'vega-lite/build/src/stack';
import { TitleParams } from 'vega-lite/build/src/title';
import { Property } from '../property';
import { WildcardProperty, Wildcard } from '../wildcard';
import { EncodingQuery } from './encoding';
import { TransformQuery } from './transform';
/**
 * A "query" version of a [Vega-Lite](https://github.com/vega/vega-lite)'s `UnitSpec` (single view specification).
 * This interface and most of  its children have `Query` suffixes to hint that their instanced are queries that
 * can contain wildcards to describe a collection of specifications.
 */
export interface SpecQuery {
    data?: Data;
    mark: WildcardProperty<Mark>;
    transform?: TransformQuery[];
    /**
     * Array of encoding query mappings.
     * Note: Vega-Lite's `encoding` is an object whose keys are unique encoding channels.
     * However, for CompassQL, the `channel` property of encoding query mappings can be wildcards.
     * Thus the `encoding` object in Vega-Lite is flatten as the `encodings` array in CompassQL.
     */
    encodings: EncodingQuery[];
    /**
     * The width of the resulting encodings.
     * __NOTE:__ Does not support wildcards.
     */
    width?: number | 'container' | Step | Wildcard<Step>;
    /**
     * The height of the resulting encodings.
     * __NOTE:__ Does not support wildcards.
     */
    height?: number | 'container' | Step | Wildcard<Step>;
    /**
     * CSS color property to use as the background of visualization.
     * __NOTE:__ Does not support wildcards.
     */
    background?: string;
    /**
     * The default visualization padding, in pixels, from the edge of the
     * visualization canvas to the data rectangle. If a number, specifies
     * padding for all sides. If an object, the value should have the
     * format {"left": 5, "top": 5, "right": 5, "bottom": 5}
     * to specify padding for each side of the visualization.
     *
     * __NOTE:__ Does not support wildcards.
     */
    padding?: number | Object;
    /**
     * Title for the plot.
     * __NOTE:__ Does not support wildcards.
     */
    title?: string | TitleParams<any>;
    /**
     * Vega-Lite Configuration
     */
    config?: Config;
}
/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
export declare function fromSpec(spec: TopLevel<FacetedUnitSpec>): SpecQuery;
export declare function isAggregate(specQ: SpecQuery): boolean;
/**
 * @return The Vega-Lite `StackProperties` object that describes the stack
 * configuration of `specQ`. Returns `null` if this is not stackable.
 */
export declare function getVlStack(specQ: SpecQuery): StackProperties;
/**
 * @return The `StackOffset` specified in `specQ`, `undefined` if none
 * is specified.
 */
export declare function getStackOffset(specQ: SpecQuery): StackOffset;
/**
 * @return The `ExtendedChannel` in which `stack` is specified in `specQ`, or
 * `null` if none is specified.
 */
export declare function getStackChannel(specQ: SpecQuery): ExtendedChannel;
/**
 * Returns true iff the given SpecQuery has the properties defined
 * to be a potential Stack spec.
 * @param specQ The SpecQuery in question.
 */
export declare function hasRequiredStackProperties(specQ: SpecQuery): boolean;
/**
 * Returns true iff the given `specQ` contains a wildcard.
 * @param specQ The `SpecQuery` in question.
 * @param opt With optional `exclude` property, which defines properties to
 * ignore when testing for wildcards.
 */
export declare function hasWildcard(specQ: SpecQuery, opt?: {
    exclude?: Property[];
}): boolean;
