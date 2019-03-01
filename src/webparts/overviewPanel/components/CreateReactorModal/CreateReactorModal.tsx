import * as React from 'react';
import {Modal} from 'office-ui-fabric-react/lib/modal';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {PrimaryButton} from 'office-ui-fabric-react/lib/Button';
import {Label} from 'office-ui-fabric-react/lib/Label';

const CreateNewReactorModal = (props) => {
  return(
    <Modal
      isBlocking={true}
      isOpen={true}>
        <div>
          <TextField label="Name of the new reactor" />
          <PrimaryButton>Create new Reactor</PrimaryButton>
        </div>
      </Modal>
  );
};

export default CreateNewReactorModal;
