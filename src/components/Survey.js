import React from 'react';

const styleRed = {color : '#FF0000' };
let styleNoteData = styleRed;
let styleNoteMessage = styleRed;
let  isCorrect = false;
                   
export class Survey extends React.Component {
	constructor(props) {
  		super(props)
    	this.onSubmit = this.onSubmit.bind(this);
	    this.state = {
	    	datas : [],
	    	selectedValues: '',
	    }
  	}

  	componentDidMount()
	{
		fetch('data/survey.json')
		.then(response => response.json())
		.then(dataJSON => dataJSON.questions.map(surv => (
			{
				ques:`${surv.text}`,
				correct: `${surv.correct}`,
				ans: `${surv.answers}`,
			}))
			)
		.then(datas => this.setState({
			datas
		}))
		.catch(error => console.log('parsing failed: ', error))
		
	}

  	onSubmit(e) {
  		e.preventDefault();
  		var getDatas = this.state.selectedValues;
    	if(getDatas === ''){
    		document.getElementById('noteMessage').innerHTML = 'Please Select The Answers!';
    	}
    	else{
    		var count = 0;
    		var dataSubmit = Object.values(getDatas);
    		dataSubmit.map((el,l) => {
    			const subEle = el.split(',');
    			//console.log(subEle[2]);
    			if(subEle[2] === 'true'){
					count++;
				}
				return count;
    		})
    		var rateP = (parseInt(count, 10) * 100) / parseInt(dataSubmit.length, 10);
    		//console.log('rateP: '+rateP);
    		var noteMessage = document.getElementById('noteMessage');
    		if(rateP > 50 ){
    			noteMessage.innerHTML = 'Your Answers Correct ' + rateP + '% ';
    			noteMessage.style.color = '#2980b9';
    		}
    		else if(rateP > 0){
    			noteMessage.innerHTML = 'Your Answers Correct ' + rateP + '% ';
    			noteMessage.style.color = '#f39c12';
    		}
    		else{
    			noteMessage.innerHTML = 'Your Answers Incorrect!'
    			noteMessage.style.color = '#FF0000';
    		}
    	}
  	}
  
  	onRadioSelected(questions, e) {
  		var val = [] 
		val = e.target.value.split(',');
		var qNum = parseInt(val[3],10) + 1;
		var cValue = parseInt(val[0],10);
		var sValue = parseInt(val[1],10) + 1;
		var idElemNote = 'noteData'+ val[3];
    	var elID = document.getElementById(idElemNote);
    	if(cValue === sValue){ 
			styleNoteData = '#2980b9';
			isCorrect = true;
		}
		else{
			styleNoteData = '#FF0000';
		 	isCorrect = false;
		}
		var valS = qNum + ',' + sValue + ',' + isCorrect;
		var noteSMS = 'You are selected answer is ( '+ val[2] + ' ) in qustion ' + qNum; 
    	elID.style.color = styleNoteData;
    	elID.innerHTML = noteSMS;
    	const updatedSelectedValues = Object.assign({}, this.state.selectedValues,{[questions]: valS});
  		this.setState({selectedValues: updatedSelectedValues})
    	//console.log(updatedSelectedValues);
  	}

  	render(){
  		const {datas} = this.state;
  		return(
  			<div className="con-survey">
  			<p id="noteMessage" style={styleNoteMessage}></p>
  			<ol className="listNumber">
  			<form onSubmit={this.onSubmit}>
  			{
  				datas.length > 0 ? datas.map((data, l) =>{
					const {ques, correct, ans} = data;
					const ansList = ans.split(',');
					return <li key={l.toString()} className="inner-con-survey">
					<h2 key={ques}>{ques}</h2>
					<ul className="nolist">
						{
							ansList.map((el, i) => { 
								const anw = `${l}anw${i}`;
								const queN = `questions${l}`;
								return (
									<li key={i.toString()}>
										<input type="radio" 
			          					name={queN}
						                onChange={(e) => {this.onRadioSelected(queN, e)}}
						                value={`${correct},${i},${el},${l}`} id={anw} />
										<label htmlFor={anw}>{el}</label>
									</li>
								)
							})
						}
                	</ul>
                	<p id={`noteData${l}`} className='note-data'></p>
					</li>
				}) : 'Data Not Found'
  			}
            <button type="submit">Submit</button>
            </form>
            </ol>
            </div>
  		)
  	}
}
