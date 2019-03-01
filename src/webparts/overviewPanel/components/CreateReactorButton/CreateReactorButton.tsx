import * as React from 'react';
import {CompoundButton} from 'office-ui-fabric-react/lib/Button';
import styles from './CreateReactorButton.module.scss';



const CreateReactorButton = (props) => {
  console.log(props);
  return (
    <div>
      <CompoundButton
        secondaryText="Be aware that this may include some more work and potential risk"
        iconProps={{iconName: "CirclePlus"}}
        className={styles.createNewButton}
        primary={true}
        onClick={props.onClick}
        >
        Create new reactor
      </CompoundButton>
    </div>
  );
};


export default CreateReactorButton;
