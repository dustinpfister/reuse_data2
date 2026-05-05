const json_tools = ( function() {

    const api = {};

    const to_date_str = ( date = new Date() ) => {
        const m = String( date.getMonth() + 1).padStart(2,'0');
        const d = String( date.getDate()).padStart(2, '0');
        return date.getFullYear() + m + d;
    };

    api.get_config = () => {
        return fetch('/json?mode=config', {
            method: "GET"
        })
        .then((data)=>{ 
            return data.json();
        });
    };
    
    
    //!!! this should not be here, in place of having this here there should be server side handing of any data that
    // is given, and the blanks should be filled in there.
    
    const DEFAULT_CONF = {
  "color_tags": {
    "automatic": true,
    "manual": {
      "i_array": 0,
      "i_color": 0
    },
    "array": [
      {
        "first_tuesday": "2025-09-09T04:00:00.000Z",
        "first_index": 0,
        "ascending": true,
        "discounts": [ [ 25, 3 ], [ 50, 2 ] ],
        "cull": 1,
        "data": [
          { "i": 0, "desc": "Green", "web": "#00dd00" },
          { "i": 1, "desc": "Blue", "web": "#dd0000" },
          { "i": 2, "desc": "Yellow", "web": "#dddd00" },
          { "i": 3, "desc": "Orange", "web": "#dd5500" },
          { "i": 4, "desc": "Red", "web": "#ffdd00" }
        ]
      }
    ]
  }
}
    
    
    api.update_config = (conf = DEFAULT_CONF ) => {
        return fetch('/json?mode=config', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mode: 'conf_update',
                conf: conf
            })
        })
    };

    api.get_items_page = (start = new Date(), end = new Date()) => {
        const ds = to_date_str(start);
        const de = to_date_str(end);
        const au = 'false';
        const uid = ''; // leave as empty string for current user
        const ipp = 10;
        return fetch('/json?mode=items&ds=' + ds + '&de=' + de + '&au=' + au + '&uid=' + uid + '&ipp=' + ipp, {
            method: "GET"
        })
        .then((data)=>{ 
            return data.json();
        })
        .then((obj)=>{
            return obj;
        })
    };

    return api;

}());
