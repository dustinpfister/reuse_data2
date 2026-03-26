const el_ds = document.querySelector("#dept_select");
const el_ptype = document.getElementById('ptype_select');
const el_ps = document.querySelector("#price_select");
const el_cs = document.querySelector("#count_select");
const el_out = document.querySelector("#out");
const el_submit_item = document.querySelector("#submit_item");

const CONFIG = {};

const post_item = (depart_index=0, price_index=0, count=1)=> {
  return fetch('/json', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        mode: 'post_item',
        price_type: el_ptype.value,
        depart_index: depart_index,
        price_index: price_index,
        count: count
    })
  })
};

const del_items = (rec_nums=[])=> {
  return fetch('/json', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        mode: 'del_items',
        rec_nums: rec_nums
    })
  })
};

const get_config = () => {
  return fetch('/json?config=true', {
    method: "GET"
  })
  .then((data)=>{ 
    return data.json()
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
/********* **********
print_items
********** *********/
const create_header_tr = (item={}) => {
    const tr = document.createElement('tr');
    Object.keys(item).forEach((key)=>{
        const th = document.createElement('th');
        th.innerText = key;
        tr.appendChild(th);
    });
    const th = document.createElement('th');
    th.innerText = 'actions';
    tr.appendChild(th);
    return tr;
};
const print_items = () => {
  return get_items()
  .then ( (result)=> {
    let total_grand = 0;
    const dept = CONFIG.DEPT_OPTIONS.split(',');
    const table = document.createElement('table');
    table.appendChild( create_header_tr( result.items[0] ) );
    result.items.forEach( (item, i) => {
      const total_price = item.count * item.price;
      total_grand += total_price;
      const tr = document.createElement('tr');
      Object.keys(item).forEach((key)=>{
          const td = document.createElement('td');
          td.innerText = item[key];
          tr.appendChild(td);
      });
      const td = document.createElement('td');
      const input_del = document.createElement('input');
      input_del.value = 'del';
      input_del.type='button';
      input_del.addEventListener('click', ()=>{
          del_items([item.rec_num])
          .then(()=>{
              print_items();
          });
      });
      td.appendChild(input_del)
      tr.appendChild(td);
      table.appendChild(tr);
    });
    const container = document.querySelector('#disp_items');
    container.innerHTML = '';
    container.appendChild(table);
  });
};

get_config()
.then((config)=>{

  Object.assign(CONFIG, config);

  CONFIG.DEPT_OPTIONS.split(',').forEach( (dept_str, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = i + ') ' + dept_str;
    el_ds.appendChild(opt)
  });
  
  CONFIG.PRICE_OPTIONS.split(',').forEach( (price_str, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = i + ') ' + price_str;
    el_ps.appendChild(opt)
  });
  
  CONFIG.COUNT_OPTIONS.split(',').forEach( (count_str, i) => {
    const opt = document.createElement('option');
    opt.value = count_str;
    opt.innerText = i + ') ' + count_str;
    el_cs.appendChild(opt)
  });
  


/*
const update = () => {
  el_out.innerText = el_ds.value + ' ' + el_ps.value + ' x ' + el_cs.value;
};

el_ds.addEventListener('change', update);
el_ps.addEventListener('change', update);
el_cs.addEventListener('change', update);

  update();
*/

  el_submit_item.addEventListener('click', ( ) => {
    post_item(el_ds.value, el_ps.value, el_cs.value)
    .then(()=>{
      return print_items();
    })
  });
  
  
  print_items();
  
});




