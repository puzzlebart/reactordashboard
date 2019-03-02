export interface IOverviewPanelState {
  isLoading: boolean;
  modalIsShowing: boolean;
  reactors: any;
  newReactorName: string;
  waitMessage: string;
  isDeleting: boolean;
  tempData: ITempData;
  totalWatt: number;
}


export interface ITempData {
  messageId: string;
  temperature: number;
  humidity: number;
}
