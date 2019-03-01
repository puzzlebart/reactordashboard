import * as React from 'react';
import styles from './OverviewPanel.module.scss';
import { IOverviewPanelProps } from './IOverviewPanelProps';
import { IOverviewPanelState } from './IOverviewPanelState';
import CreateReactorButton from './CreateReactorButton/CreateReactorButton';
import {format} from 'date-fns';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton,DefaultButton, CompoundButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react';

export default class OverviewPanel extends React.Component<IOverviewPanelProps, IOverviewPanelState> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            modalIsShowing: false,
            reactors: undefined,
            newReactorName: '',
            waitMessage: '',
            isDeleting: false,
        };
    }

    public componentDidMount() {
        this.getReactors();
    }

    public render(): React.ReactElement<IOverviewPanelProps> {
        if (!this.state) { return <div />; }
        return (
            <div className={styles.overviewPanel}>
                {this.state.isDeleting && this.displayDeleteMessage()}
                {this.state.reactors && this.renderReactors(this.state.reactors)}
                {this.renderCreateNewButton()}
                {this.renderDialog()}
            </div>
        );
    }

    private async getReactors() {
        const url = "https://reactorapi.azurewebsites.net/api/GetReactor?code=PaHpQhekrGBqnOonAUue2wcUamtS8dAdPrfu3C8iuV1xbc/YksvBGQ==";
        let data = await fetch(url);
        let parsed = await data.json();
        let withTemp = await this.mapTemperatures(parsed.reactors);
        console.log(withTemp);
        this.setState({
          reactors: withTemp
        });
        window.setTimeout(() => this.getReactors(), 5000);
    }

    private async mapTemperatures(reactors) {
      for(let i = 0; i < reactors.length; i++) {
        let reactor = reactors[i];
        let tempdata = await this.getTemperature(reactor.Url);
        reactor['temperature'] = tempdata.temperature;
        reactor['updated'] = tempdata.last_update;
      }
      return reactors;
    }

    private async createReactor(name: string) {
        this.updateWaitMessage();
        const url = `https://reactorapi.azurewebsites.net/api/CreateReactorCore?code=SYA8aVRuvDuzzFP35JgT6ZAld5cpI0HqcaTzkvuej/59jMASiKDkcg==&name=${name}`;
        let status = await fetch(url, {
            method: "POST",
            mode: "cors"
        });
        let id = window.setTimeout(() => {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }
        this.setState({
          waitMessage: '',
          newReactorName: '',
          modalIsShowing: false
        });
        this.getReactors();
    }

    private async deleteReactor(reactor) {
      this.setState({
        isDeleting: true
      });
      const url = `https://reactorapi.azurewebsites.net/api/DeleteReactorCore?code=3z49lpcJAeKeIhdfynFIDT1Hp0InY3hMisnQFU1fF8uVMq5CwmfUyQ==&id=${reactor.id}&uuid=${reactor.UUID}`;
      let status = await fetch(url, {
        method: "POST",
        mode: "cors"
      });
      let id = window.setTimeout(() => {}, 0);
      while (id--) {
          window.clearTimeout(id);
      }
      this.setState({
        isDeleting: false
      });
      this.getReactors();
    }

    private async getTemperature(coreUrl) {
        let baseUrl = "https://reactorapi.azurewebsites.net/api/GetCoreTemp?code=VweclAbKdOyeN8Jw76RAy7R5GyjovNsZv4YIJ6D5/EkkgWXRoL7BlA==";
        let data = await fetch(`${baseUrl}&url=${coreUrl}`);
        let parsed = await data.json();
        return parsed.coretempdata;
    }

    private renderReactors(reactors) {
      return(
        <div className={styles.reactorBlocks}>
          {
            reactors.map(reactor => {
              return <div>{this.renderReactor(reactor)}</div>;
            })
          }
        </div>
      );
    }

    private updateWaitMessage() {
      console.log(this.state.waitMessage);
      const messages = ['Calling the russians', 'Travelling to China', 'Folding thumbs', 'Overthrowing the Iranian Government', 'Choking bart', 'Burning trashcans', 'Buying Uranium' ];
      let rand = messages[Math.floor(Math.random() * messages.length)];
      this.setState({
        waitMessage: rand
      });
      window.setTimeout(() => this.updateWaitMessage(), 7000);
    }

    private renderReactor(reactor) {
        let newDate = new Date(reactor.updated);
        return (
            <div className={styles.reactor}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M167.8 256.2H16.2C7.1 256.2-.6 263.9 0 273c5.1 75.8 44.4 142.2 102.5 184.2 7.4 5.3 17.9 2.9 22.7-4.8L205.6 324c-22.6-14.3-37.8-39.2-37.8-67.8zm37.8-67.7c12.3-7.7 26.8-12.4 42.4-12.4s30 4.7 42.4 12.4L370.8 60c4.8-7.7 2.4-18.1-5.6-22.4C330.3 18.8 290.4 8 248 8s-82.3 10.8-117.2 29.6c-8 4.3-10.4 14.8-5.6 22.4l80.4 128.5zm42.4 19.7c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zm231.8 48H328.2c0 28.6-15.2 53.5-37.8 67.7l80.4 128.4c4.8 7.7 15.3 10.2 22.7 4.8 58.1-42 97.4-108.4 102.5-184.2.6-9-7.1-16.7-16.2-16.7z"/></svg>
                <h1>{reactor.Name}</h1>
                <div className={styles.temperatureRow}>
                  <Icon iconName="Frigid" />
                  <p>Temperature</p>
                  <p>{Math.round(reactor.temperature*100)/100}</p>
                </div>
                <div className={styles.timeRow}>
                  <Icon iconName="Clock" />
                  <p>Last update</p>
                  <p>{format(newDate, 'HH:mm:ss')}</p>
                </div>
                <PrimaryButton className={styles.deleteButton} onClick={() =>this.deleteReactor(reactor)}>Delete reactor</PrimaryButton>
            </div>
        );
    }

    private openDialog() {
      this.setState({
        modalIsShowing: true
      });
    }

    private closeDialog() {
      this.setState({
        modalIsShowing: false
      });
    }

    private renderDialog() {
      return (
        <Dialog
          hidden={!this.state.modalIsShowing}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: 'Create a new Reactor core',
            subText: 'Please enter the name of the reactor'
          }}>
            <TextField onChanged={(newValue) => this.setState({newReactorName: newValue})}></TextField>
            <DialogFooter>
              {this.state.waitMessage.length > 0 && this.displayWaitMessage()}
              <PrimaryButton onClick={() => this.createReactor(this.state.newReactorName)}>Create</PrimaryButton>
              <DefaultButton onClick={() => this.closeDialog()}>Cancel</DefaultButton>
            </DialogFooter>
          </Dialog>
      );
    }

    private displayWaitMessage() {
      return (
        <div style={{display: 'flex'}}>
          <Label className={styles.waitingText}>{this.state.waitMessage}</Label>
          <Spinner className={styles.spinner} size={SpinnerSize.small}/>
        </div>
      );
    }
    private displayDeleteMessage() {
      return (
        <div style={{display: 'flex', marginLeft: '10'}}>
          <Label className={styles.deleteText}>Deleting Reactor core, please wait</Label>
          <Spinner className={styles.spinner} size={SpinnerSize.large}/>
        </div>
      );
    }

    private renderCreateNewButton() {
      return(
        <CompoundButton
              secondaryText="Be aware that this may include some more work and potential risk"
              iconProps={{iconName: "CirclePlus"}}
              primary={true}
              onClick={() => this.openDialog()}
              className={styles.createButton}
        >
          Create new reactor
        </CompoundButton>
    );
    }
}
