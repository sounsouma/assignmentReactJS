import React from 'react';
import ReactDOM from 'react-dom';

import "./css/styles.css";

import {Header} from './components/Header.js';
import {Survey} from './components/Survey.js';

class App extends React.Component{
	render(){
		return(
			<div className="container">
        		<Header/>
        		<Survey/>
      		</div>
		)
	}
}

const Content = document.getElementById('content');
ReactDOM.render(<App />, Content);

