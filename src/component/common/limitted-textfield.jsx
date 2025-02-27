import React from 'react';
import TextField from '@material-ui/core/TextField';

class LimittedTextField extends React.Component {
  state = { value: this.props.value };

  componentDidUpdate(prevProps, _) {
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.toInt(this.props.value).toString() });
    }
  }

  onChange = event => {
    const roundedValue = this.toInt(event.target.value);
    this.setState({ value: roundedValue.toString() });
    this.props.onChange(roundedValue);
  };

  toInt = value => Math.round(parseInt(value));

  render() {
    const {
      limit: { min, max },
    } = this.props;
    const { value } = this.state;
    return (
      <TextField
        fullWidth
        inputProps={{ min: min, max: max }}
        margin="dense"
        multiline={false}
        type="number"
        value={value || '0'}
        onChange={this.onChange}
      />
    );
  }
}

export default LimittedTextField;
