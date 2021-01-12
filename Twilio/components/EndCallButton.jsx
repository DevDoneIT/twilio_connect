import React from 'react';
import { inject, observer } from 'mobx-react';
import clsx from 'clsx';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';


const useStyles = makeStyles((theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

const EndCallButton = (props) => {
    const { className, twilioModel: room } = props;
  const classes = useStyles();

  return (
    <Button onClick={() => room.disconnect()} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Disconnect
    </Button>
  );
}

export default inject('twilioModel')(observer(EndCallButton));
