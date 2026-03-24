
const post_item = (depart_index=0, price_index=0, count=1)=> {
  return fetch('/json', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        depart_index: depart_index,
        price_index: price_index,
        count: count
    })
  })
};

const get_items = () => {

  return fetch('/json', {
    method: "GET"
  })
  .then((data)=>{ 
    return data.json()
  })
};

get_items()
.then(( result ) => {
  let html = '<table>';
  html += '<tr><th>i</th><th>price</th><th>count</th><th>total price</th></tr>';
  let total_grand = 0;
  result.items.forEach( (item, i) => {
    const total_price = item.count * item.price;
    total_grand += total_price;
    html += '<tr>'+
      '<td>' + item.rec_num + '</td><td>' + item.price.toFixed(2) + '</td><td>' + item.count + '</td>'+
      '<td>' + total_price.toFixed(2) + '</td>'+
    '</tr>';
  });
  html += '</table>';
  html += '<p> grand total: ' + total_grand.toFixed(2) + '</p>';
  document.querySelector('#disp_items').innerHTML = html;
});
