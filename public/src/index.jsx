import React from 'react';
import Search from './components/search.jsx';
import PersonalityList from './components/personality-list.jsx';
import $ from 'jquery';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        consumptionPreference : [],
        needs: [],
        values: [],
        searches: [],
        optionsState: '',
      }
   }

  componentWillMount(){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "/artist",
        type: 'GET',
        dataType: 'json',
        success: function(response){
            resolve(response);
        }
      });
  }).then(result =>{
    var personality = JSON.parse(result[0].personality);
    var names = [];
    result.forEach(item =>{
       names.push(item.artistName);
    });
    this.setState({
      searches: names,
      consumptionPreference: personality['consumption_preferences'],
      needs: personality['needs'],
      values: personality['values'],
    });
  });
}

  onSearch(value){
    var name = value.toLowerCase();
    return new Promise((resolve, reject) => {
    $.ajax({
      url: "/artist",
      type: 'POST',
      data: value,
      dataType: 'application/x-www-form-urlencoded',
      success: function(response){
          resolve(response);
      }
    });
  }).then(result => {
    result = JSON.parse(result);
      if(Array.isArray(result)){
        var personality = JSON.parse(result[0].personality);
      } else {
        personality = JSON.parse(result.personality);
      }
      return this.setState({
        consumptionPreference: personality['consumption_preferences'],
        needs: personality['needs'],
        values: personality['values'],
        optionsState: name,
      });
  }).then(() => {
      var array = this.state.searches;
      if(array.indexOf(name) === -1){
      array.push(name);
      return this.setState({
        searches: array,
      })
    }
  });
}
 
  render() {
      return(
        <div className='row'>
          <div className='col-md-12'>
          <div>
        <Search onSearch={this.onSearch.bind(this)} searches={this.state.searches} optionsState={this.state.optionsState}/>
        </div>
        <div className='container'>
        <PersonalityList needs={this.state.needs} values={this.state.values} consumptionPreference={this.state.consumptionPreference}/>     
        </div>
          </div>
          </div>
      );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));