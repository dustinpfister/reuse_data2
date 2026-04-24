// this is the client code for main root ( / ) namespace
console.log('home client code');

json_tools.get_items_page()
.then((result)=>{
   console.log(result)
})
