import React from 'react';

function Pagination(props) {

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(props.total / props.postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return(
    pageNumbers.map(number => (
      <a
        key={number}
        id={number}
        className={props.pageNo === number ? 'item active' : 'item'}
        onClick={props.paginate}
      >
        {number}
      </a>
    ))
  );
}

export default Pagination;
