import React from 'react';

function Search(props){

    // css樣式
    const marginRight = {
      marginRight: '20px'
    };

    return (
      <div style={marginRight} className="ui icon input" >
        <input
          value={props.value}
          onChange={props.onChange}
          type="text"
          placeholder="搜尋"
        />
        <i className="search icon"></i>
      </div>
    )

}

export default Search
