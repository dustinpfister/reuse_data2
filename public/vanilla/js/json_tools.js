const json_tools = {};

const to_date_str = ( date = new Date() ) => {
    const m = String( date.getMonth() + 1).padStart(2,'0');
    const d = String( date.getDate()).padStart(2, '0');
    return date.getFullYear() + m + d;
};

json_tools.get_items_page = () => {
  const ds = to_date_str();
  const de = to_date_str();
  const au = 'false';
  const uid = ''; // leave as empty string for current user
  const ipp = 10;
  return fetch('/json?mode=items&ds=' + ds + '&de=' + de + '&au=' + au + '&uid=' + uid + '&ipp=' + ipp, {
    method: "GET"
  })
  .then((data)=>{ 
    return data.json()
  })
  .then((obj)=>{
  console.log(obj)
      return obj;
  })
};
