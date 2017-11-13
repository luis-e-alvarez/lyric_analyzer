import React from 'react';
class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchTerm : '',
        };
    }

    update(e) {
        this.setState({
            searchTerm: e.target.value,
        })
      
    }

    search(){
        this.props.onSearch(this.state.searchTerm);
        this.setState({
            searchTerm: '',
        });
    }

    clicked(e){
        this.props.onSearch(e.target.value);
    }
    
    render() {
      return (
        <div className='container search'>
        <div className="row">
          <div className='col-md-9'>
            Enter an artist: <input value ={this.state.searchTerm} onChange={this.update.bind(this)} />
            <button className='pull-right' onClick={this.search.bind(this)}>Add Artists</button>
          </div>
          <div className='col-md-3'>
          <select onChange={this.clicked.bind(this)} value={this.props.optionsState}>
            {this.props.searches.map((item, i) => {
              return <option value={item}>{item}</option>
            })};
            </select>
         </div>
         </div>
       </div>);
   }
}

export default Search;