import { DetailView, OverviewView, OverviewViewNewArgs, VivView } from '@hms-dbmi/viv';

import { ImageViewer, ImageViewerProps, LayerConfig } from './image-viewer';

export type OverviewArgs = Omit<OverviewViewNewArgs, 'initialViewState' | 'loader'>;
export interface PictureInPictureViewerProps extends ImageViewerProps {
  overview: OverviewArgs;
}

const OVERVIEW_DEFAULTS: Partial<OverviewArgs> = {
  margin: 25,
  scale: 0.15,
  position: 'bottom-left'
};

export class PictureInPictureViewer extends ImageViewer<PictureInPictureViewerProps> {
  constructor(props: PictureInPictureViewerProps) {
    super({
      ...props,
      overview: { ...OVERVIEW_DEFAULTS, ...props.overview }
    });
  }

  protected async createVivViews(): Promise<VivView[]> {
    const { loaders, width, height, props: { initialViewState, overview } } = this;
    if (loaders.length === 0) { return []; }

    const detailView = new DetailView({
      initialViewState: {
        ...initialViewState,
        id: 'detail',
        width,
        height
      }
    });

    const overviewView = new OverviewView({
      initialViewState: {
        ...initialViewState,
        id: 'overview',
        width,
        height
      },
      loader: loaders[0],
      ...overview
    });

    return [detailView, overviewView];
  }

  protected async createLayerConfigs(): Promise<LayerConfig[]> {
    const { loaders, channelConfigs } = this;
    if (loaders.length === 0) { return []; }

    const loaderSelection: { channel: string }[] = [];
    const channelIsOn: boolean[] = [];
    const colorValues: [number, number, number][] = [];
    const sliderValues: [number, number][] = [];
    for (const [key, { active, color, slider }] of Object.entries(channelConfigs)) {
      loaderSelection.push({ channel: key });
      channelIsOn.push(active);
      colorValues.push(color);
      sliderValues.push(slider);
    }

    const isRgb = loaders[0].isRgb;
    return [
      {
        loader: this.loaders[0],
        loaderSelection,
        channelIsOn: isRgb ? [true, true, true] : channelIsOn,
        colorValues: isRgb ? [[255, 0, 0], [0, 255, 0], [0, 0, 255]] : colorValues,
        sliderValues: isRgb ? [[0, 255], [0, 255], [0, 255]] : sliderValues
      }
    ];
  }
}