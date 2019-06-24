import { withStyles } from '@material-ui/styles';
import { ToggleButton } from '@material-ui/lab';

const StyledToggleButton = withStyles({
  root: {
    border: 'none',
    padding: '0',
    margin: '0',
    '&:first-child': {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
    },
    '&:last-child': {
      paddingLeft: '0',
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
    },
    '&:not(:first-child)': {
      borderLeft: '0',
      marginLeft: '0',
    },
    '&:hover': {
      borderRadius: '8px',
    },
  },
  selected: {
    borderRadius: '8px',
    backgroundColor: 'transparent !important',
    color: 'rgba(0, 0, 0, 0.87) !important',
  },
  sizeSmall: {
    height: '28px',
    minWidth: '28px',
  },
})(ToggleButton);

export default StyledToggleButton;
