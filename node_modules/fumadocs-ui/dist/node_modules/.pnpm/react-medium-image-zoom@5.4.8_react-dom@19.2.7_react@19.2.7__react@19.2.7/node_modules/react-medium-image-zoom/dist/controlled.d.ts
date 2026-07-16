import React from "react";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/controlled.d.ts
type ModalState = 'LOADED' | 'LOADING' | 'UNLOADED' | 'UNLOADING';
interface ControlledProps {
  a11yNameButtonUnzoom?: string;
  a11yNameButtonZoom?: string;
  canSwipeToUnzoom?: boolean;
  children: React.ReactNode;
  classDialog?: string;
  IconUnzoom?: React.ElementType;
  IconZoom?: React.ElementType;
  isDisabled?: boolean;
  isZoomed: boolean;
  onZoomChange?: (value: boolean, data: {
    event: React.SyntheticEvent | Event;
  }) => void;
  swipeToUnzoomThreshold?: number;
  wrapElement?: 'div' | 'span';
  ZoomContent?: (data: {
    buttonUnzoom: React.ReactElement<HTMLButtonElement>;
    img: React.ReactElement | null;
    isZoomImgLoaded: boolean;
    modalState: ModalState;
    onUnzoom: (e: Event) => void;
  }) => React.ReactElement;
  zoomImg?: React.ImgHTMLAttributes<HTMLImageElement>;
  zoomMargin?: number;
}
//#endregion
export { ControlledProps };