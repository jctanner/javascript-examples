import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Widget} from './Widget.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //counter: 0,
      widgets: [],
      widgetids: []
    };
  }

  handleWidgetClick(widgetid) {
    console.log("delete widget " + widgetid.toString());
    let widgets = [...this.state.widgets];
    const widgetids = [...this.state.widgetids];
    let newwidgets = [...widgets].filter(function(val) {return val.widget_id !== widgetid})
    console.log('remaining widgets ...');
    console.log(newwidgets);
    this.setState({
      widgets: [...newwidgets],
      widgetids: [...widgetids]
    })
  }

  handleClick() {
    console.log("clicking");
    let widgetids = [...this.state.widgetids];
    let widgets = [...this.state.widgets];

    let widgetid = 0;
    if ( this.state.widgetids.length > 0) {
      const windex = widgetids.length - 1;
      console.log("windex: " + windex.toString());
      const lastwidgetid = widgetids[windex];
      console.log('last windex: ' + lastwidgetid.toString());
      widgetid = lastwidgetid + 1;
    }
    console.log('new widgetid ' + widgetid.toString());
    widgetids.push(widgetid);
    widgets.push({
      widget_id: widgetid,
      widget_name: "widget" + (widgetid).toString(),
      widget_counter: 0
    })
    this.setState({
      widgets: [...widgets],
      widgetids: [...widgetids]

    })
  }

  renderWidget(widgetid) {
    let thiswidget = this.state.widgets.find(widget => widget.widget_id === widgetid);
    console.log("found widget ...");
    console.log(thiswidget);
    return (
      <div>
        <Widget
          key={widgetid}
          widget_id={widgetid}
          widget_name={thiswidget.widget_name}
          widget_count={thiswidget.widget_count}
          onClick={() => this.handleWidgetClick(thiswidget.widget_id)}
        />
        <br></br>
      </div>
    )
  }

  render() { 
    return (
      <div className="App">
        <header className="App-header">
          {this.state.widgets.map((widget, i) => (
            this.renderWidget(widget.widget_id)
          ))}
          <br></br>
          <button type="button" onClick={() => this.handleClick()}>click me</button>
        </header>
      </div>
    );
  }

}

export default App;
