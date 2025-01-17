import { QueryConfig } from './config';
import { FieldQuery } from './query/encoding';
import { ExpandedType } from './query/expandedtype';
/**
 * Table Schema Field Descriptor interface
 * see: https://specs.frictionlessdata.io/table-schema/
 */
export interface TableSchemaFieldDescriptor {
    name: string;
    title?: string;
    type: PrimitiveType;
    format?: string;
    description?: string;
}
/**
 * Field Schema
 */
export interface FieldSchema extends TableSchemaFieldDescriptor {
    vlType?: ExpandedType;
    index?: number;
    originalIndex?: number;
    stats: DLFieldProfile;
    binStats?: {
        [maxbins: string]: DLFieldProfile;
    };
    timeStats?: {
        [timeUnit: string]: DLFieldProfile;
    };
    ordinalDomain?: string[];
}
/**
 * Table Schema
 * see: https://specs.frictionlessdata.io/table-schema/
 */
export interface TableSchema<F extends TableSchemaFieldDescriptor> {
    fields: F[];
    missingValues?: string[];
    primaryKey?: string | string[];
    foreignKeys?: object[];
}
/**
 * Build a Schema object.
 *
 * @param data - a set of raw data in the same format that Vega-Lite / Vega takes
 * Basically, it's an array in the form of:
 *
 * [
 *   {a: 1, b:2},
 *   {a: 2, b:3},
 *   ...
 * ]
 *
 * @return a Schema object
 */
export declare function build(data: any, opt?: QueryConfig, tableSchema?: TableSchema<TableSchemaFieldDescriptor>): Schema;
export declare class Schema {
    private _tableSchema;
    private _fieldSchemaIndex;
    constructor(tableSchema: TableSchema<FieldSchema>);
    /** @return a list of the field names (for enumerating). */
    fieldNames(): string[];
    /** @return a list of FieldSchemas */
    get fieldSchemas(): FieldSchema[];
    fieldSchema(fieldName: string): FieldSchema;
    tableSchema(): TableSchema<FieldSchema>;
    /**
     * @return primitive type of the field if exist, otherwise return null
     */
    primitiveType(fieldName: string): PrimitiveType;
    /**
     * @return vlType of measturement of the field if exist, otherwise return null
     */
    vlType(fieldName: string): ExpandedType;
    /** @return cardinality of the field associated with encQ, null if it doesn't exist.
     *  @param augmentTimeUnitDomain - TimeUnit field domains will not be augmented if explicitly set to false.
     */
    cardinality(fieldQ: FieldQuery, augmentTimeUnitDomain?: boolean, excludeInvalid?: boolean): number;
    /**
     * Given an EncodingQuery with a timeUnit, returns true if the date field
     * has multiple distinct values for all parts of the timeUnit. Returns undefined
     * if the timeUnit is undefined.
     * i.e.
     * ('yearmonth', [Jan 1 2000, Feb 2 2000] returns false)
     * ('yearmonth', [Jan 1 2000, Feb 2 2001] returns true)
     */
    timeUnitHasVariation(fieldQ: FieldQuery): boolean;
    domain(fieldQueryParts: {
        field: string;
    }): any[];
    /**
     * @return a Summary corresponding to the field of the given EncodingQuery
     */
    stats(fieldQ: FieldQuery): DLFieldProfile;
}
export declare enum PrimitiveType {
    STRING,
    NUMBER,
    INTEGER,
    BOOLEAN,
    DATETIME
}
