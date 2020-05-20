import React, {Component} from 'react';

export class Widget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            widget_id: props.widget_id,
            widget_name: props.widget_name,
            widget_count: 0,

        }
    }

    render() {
        console.log("render widget " + this.state.widget_id.toString());
        return (
            <button onClick={this.props.onClick} key={this.state.widget_id}>
                {this.state.widget_name}
            </button>
        )
    }
}