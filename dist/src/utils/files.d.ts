import { MakeDirectoryOptions } from 'fs';
import { ConfigOptions } from '../../typings/types';
export declare const ensureDirExists: (dir: string, options?: MakeDirectoryOptions) => void;
export declare const getDataAsJson: (fileName: string) => ConfigOptions[];
export declare const storeDataAsJson: (filePath: string, fileName: string, data: any) => Promise<boolean>;
//# sourceMappingURL=files.d.ts.map