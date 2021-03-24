import { MakeDirectoryOptions } from 'fs';
export declare const ensureDirExists: (dir: string, options?: MakeDirectoryOptions) => void;
export declare const getDataAsJson: <T>(fileName: string) => T;
export declare const storeDataAsJson: (filePath: string, fileName: string, data: any) => Promise<void>;
export declare const checkFileExists: (fileName: string, mode?: number) => boolean;
//# sourceMappingURL=files.d.ts.map