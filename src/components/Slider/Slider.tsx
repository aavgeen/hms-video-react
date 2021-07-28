import React from 'react';
import MaterialSlider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

export const Slider = withStyles({
  root: {
    color: 'white',
    maxWidth: '100%',
  },
  thumb: {
    backgroundColor: 'black',
    border: '2px solid currentColor',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
    color: 'white',
  },
  active: {},
  valueLabel: {
    color: 'white',
  },
})(MaterialSlider);
