/**
 * JSON mode type
 */
export declare enum JsonMode {
    unique = "unique",
    duplicate = "duplicate"
}
/**
 * Optional
 * @desc Type representing [`Optional`] in TypeScript: `T | null | undefined`
 */
export declare type Optional<T> = T | null | undefined;
/**
 * ConfigOptions
 * @desc Type representing configuration options
 */
export declare type ConfigOptions = {
    sourceFile?: string;
    targetPath?: string;
    targetFile?: string;
    jsonMode?: JsonMode;
    jsonPath?: string;
    jsonFields?: string[];
};
//# sourceMappingURL=types.d.ts.map