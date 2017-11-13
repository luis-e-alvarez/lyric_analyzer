import React from 'react';

const PersonalityList = (props) => (
       
         <div className='row'>
          <div className='col-md-4 needs'>
            <h3>Needs</h3>
            {props.needs.map((item,i) => {
              return <div key={i}>{item.name}, <b>{(item.percentile * 100).toString().slice(0,4)}%</b></div>;
            })}
           </div>
          <div className='col-md-4 values'>
            <h3>Values</h3>
              {props.values.map((item,i) => {
                 return <div key={i}>{item.name}, <b>{(item.percentile*100).toString().slice(0,4)}%</b></div>;
              })}
          </div>
          <div className='col-md-4 consumption'>
              <h3>Consumption Preferences</h3>
                {props.consumptionPreference.map((item,i) => {
                  return <div key={i}>{item.consumption_preferences[0].name}, <b>{item.consumption_preferences[0].score}</b></div>;
                })}
         </div>
        </div>
    );


export default PersonalityList;