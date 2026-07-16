import { HTMLAttributes, ReactNode } from "react";
//#region src/components/files.d.ts
declare function Files({ className, ...props }: HTMLAttributes<HTMLDivElement>): React.ReactElement;
interface FileProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: ReactNode;
}
interface FolderProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  disabled?: boolean;
  /**
   * Open folder by default
   *
   * @defaultValue false
   */
  defaultOpen?: boolean;
}
declare function File({ name, icon, className, ...rest }: FileProps): React.ReactElement;
declare function Folder({ name, defaultOpen, ...props }: FolderProps): React.ReactElement;
//#endregion
export { File, FileProps, Files, Folder, FolderProps };